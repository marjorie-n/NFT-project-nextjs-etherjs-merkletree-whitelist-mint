const { ethers } = require("hardhat"); // librairie pour communiquer avec le frontend
const { MerkleTree } = require("merkletreejs"); // librairie pour créer un arbre de merkle
const keccak256 = require("keccak256"); // librairie pour hasher les données
const { expect } = require("chai"); // librairie pour les tests
const tokens = require("../tokens.json"); // fichier json contenant les tokens à vendre (id, price, owner)
const { describe, it } = require("mocha"); // importation de describe et it pour les tests

// Le test vérifie si le contrat est bien un smart contract ERC721A appelé "NFTCryptoAstaro"
describe("NFTCryptoAstaro is ERC721A smart contract", function () {
  // Utilisation de la fonction "before" pour initialiser l'environnement de test
  before(async function () {
    // Récupération des signataires (owners)
    [this.owner, this.addr1, this.addr2, this.addr3] =
      await ethers.getSigners();
    await ethers.getSigners();
    
    let tab = [];
    // Récupération des adresses des tokens NFT
    tokens.map((token) => {
      tab.push(token.address);
    });

    // Création d'une structure de données arborescente pour stocker les adresses des tokens NFT
    const leaves = tab.map((address) => {
      return keccak256(address);
    });
    this.tree = new MerkleTree(leaves, keccak256, { sort: true });
    // Calcul de la racine de l'arbre Merkle
    this.merkleTreeRoot = this.tree.getHexRoot();
  });

  // Déploiement du contrat "NFTCryptoAstro"
  it("Should deploy NFTCryptoAstro smart contract", async function () {
    // Définition de l'URI de base pour les tokens NFT
    this.baseURI = "ipfs://CID/";
    // Récupération de la factory pour le contrat "NFTCryptoAstro"
    this.contract = await hre.ethers.getContractFactory("NFTCryptoAstro");
    // Déploiement du contrat "NFTCryptoAstro"
    this.deployedContract = await this.contract.deploy(
      this.merkleTreeRoot,
      this.baseURI
    );
    // console.log(this.merkleTreeRoot)
    // console.log(this.addr1.address)
    // console.log(this.addr2.address)
    // console.log(this.addr3.address)
  });

  // Test de modification du startTime de la vente
  it("should change the sale start time", async function () {
    // Calcul du timestamp actuel
    const timestamp = parseInt(new Date().getTime() / 1000);

    // Modification du startTime de la vente
    await this.deployedContract.setSaleStartTime(timestamp);

    // Vérification que le startTime a bien été modifié
    expect(await this.deployedContract.saleStartTime()).to.equal(timestamp);
  });

  // Test pour vérifier qu'un non-owner ne peut pas modifier le sale startTime
  it("should not allow non-owner to change sale startTime", async function () {
    // Calcul du timestamp actuel moins 2 secondes
    const timestamp = parseInt(new Date().getTime() / 1000);
    await expect(
      this.deployedContract.connect(this.addr3).setSaleStartTime(timestamp)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  //Test pour récupérer la valeur de la variable "step"
  //   it("should get the step, should be equal to 1", async function () {
  //     expect(await this.deployedContract.getStep()).to.equal(1);
  //   });

  // Test pour vérifier que la racine de l'arbre Merkle est bien définie et a une longueur de 66
  it("Merkle Root should be defined and have a length to 66", async function () {
    expect(await this.deployedContract.merkleRoot()).to.have.lengthOf(66);
  });

  // Test pour vérifier que la variable "isPaused" est bien définie à false

  it("Should get the isPaused, and isPaused should be equal to false ", async function () {
    expect(await this.deployedContract.isPaused()).to.equal(false);
  });

  /**whitelistSale tests */

  // Test pour vérifier que la fonction setSaleStartTime modifie la variable saleStartTime
  it("Should change saleStartTime", async function () {
    const timestamp = parseInt(new Date().getTime() / 1000) + 30 * 3600;
    await this.deployedContract.setSaleStartTime(timestamp);
    expect(await this.deployedContract.saleStartTime()).to.equal(timestamp);
  });

  // Test pour vérifier que la fonction whiteListMint révèle une erreur si l'on tente de créer un NFT avant le début de la vente WhiteList
  it("should revert if attempting to mint an NFT before the whitelist sale starts", async function () {
    // Génère une preuve pour l'adresse du propriétaire
    const leaf = keccak256(this.owner.address);
    const proof = this.tree.getHexProof(leaf);

    // Définit le prix pour le NFT
    const price = ethers.utils.parseEther("0.002");

    const overrides = {
      value: price,
    };

    await expect(
      this.deployedContract
        .connect(this.owner)
        .whiteListMint(this.owner.address, 1, proof, overrides)
    ).to.be.revertedWith("Whitelist sale is not active'");
  });

  it("Should change saleStartTime", async function () {
    const timestamp = parseInt(new Date().getTime() / 1000) - 2;
    await this.deployedContract.setSaleStartTime(timestamp);
    expect(await this.deployedContract.saleStartTime()).to.equal(timestamp);
  });

  it("Should not mint an NFT if the user is not whitelisted", async function () {
    const leaf = keccak256(this.owner.address);
    const proof = this.tree.getHexProof(leaf);

    const price = ethers.utils.parseEther("0.002");
    const overrides = {
      value: price,
    };

    await expect(
      this.deployedContract
        .connect(this.owner)
        .whiteListMint(this.owner.address, 1, proof, overrides)
    ).to.be.revertedWith("You are not whitelisted");
  });

  it("Should mint an NFT if the user is whitelisted", async function () {
    const leaf = keccak256(this.addr1.address);
    const proof = this.tree.getHexProof(leaf);

    const price = ethers.utils.parseEther("0.002");
    const overrides = {
      value: price,
    };

    await this.deployedContract
      .connect(this.addr1)
      .whiteListMint(this.addr1.address, 1, proof, overrides);
    let result = await this.deployedContract.tokensOfOwner(this.addr1.address);
    expect(result.length).to.equal(1);
  });

  it(
    "Should not mint 1 NFT if the user has already minted one NFT during the whitelist sale"
  ),
    async function () {
      const leaf = keccak256(this.addr1.address);
      const proof = this.tree.getHexProof(leaf);

      const price = ethers.utils.parseEther("0.002");
      const overrides = {
        value: price,
      };

      await expect(
        this.deployedContract
          .connect(this.addr1)
          .whiteListMint(this.addr1.address, 1, proof, overrides)
      ).to.be.revertedWith("You can only mint 1 NFT during the whitelist sale");
    };

  it("totalSupply should be equal to 1"),
    async function () {
      expect(await this.deployedContract.totalSupply()).to.equal(1);
    };

  it("Should mint an NFT if the user is whitelisted", async function () {
    const leaf = keccak256(this.addr2.address);
    const proof = this.tree.getHexProof(leaf);

    const price = ethers.utils.parseEther("0.002");
    const overrides = {
      value: price,
    };

    await this.deployedContract
      .connect(this.addr2)
      .whiteListMint(this.addr2.address, 1, proof, overrides);
    let result = await this.deployedContract.tokensOfOwner(this.addr2.address);
    expect(result.length).to.equal(1);
  });

  it("Should not mint 1NFT during the whitelist sale if not enougth ethers are provided", async function () {
    const leaf = keccak256(this.addr3.address);
    const proof = this.tree.getHexProof(leaf);

    const price = ethers.utils.parseEther("0.001");
    const overrides = {
      value: price,
    };

    await expect(
      this.deployedContract
        .connect(this.addr3)
        .whiteListMint(this.addr3.address, 1, proof, overrides)
    ).to.be.revertedWith("Not enought funds");
  });

  it(
    "Should not mint 1 NFT during the whitelist sale if max supply is exceeded"
  ),
    async function () {
      const leaf = keccak256(this.addr3.address);
      const proof = this.tree.getHexProof(leaf);

      const price = ethers.utils.parseEther("0.002");
      const overrides = {
        value: price,
      };

      await expect(
        this.deployedContract
          .connect(this.addr3)
          .whiteListMint(this.addr3.address, 1, proof, overrides)
      ).to.be.revertedWith("MAX supply exceeded");
    };

  /**publicSale tests */

  it("Should change saleStartTime", async function () {
    const timestamp = parseInt(new Date().getTime() / 1000) + 30 * 3600;
    await this.deployedContract.setSaleStartTime(timestamp);
    expect(await this.deployedContract.saleStartTime()).to.equal(timestamp);
  });

  it("Should not mint  NFTs during the public sale if the public sale has not started yet", async function () {
    const price = ethers.utils.parseEther("1");
    const overrides = {
      value: price,
    };

    await expect(
      this.deployedContract
        .connect(this.addr1)
        .publicMint(this.addr1.address, 2, overrides)
    ).to.be.revertedWith("Public sale is not active");
  });

  it("Should change saleStartTime", async function () {
    const timestamp = parseInt(new Date().getTime() / 1000) - 25 * 3600;
    await this.deployedContract.setSaleStartTime(timestamp);
    expect(await this.deployedContract.saleStartTime()).to.equal(timestamp);
  });

  it("Should not mint NFTs during the public sale if the user tries to mint more than 4 NFTs", async function () {
    const price = ethers.utils.parseEther("0.003").mul(4);
    const overrides = {
      value: price,
    };

    await expect(
      this.deployedContract
        .connect(this.addr1)
        .publicMint(this.addr1.address, 4, overrides)
    ).to.be.revertedWith("You can only mint 3 NFTs during the public sale");
  });

  it("Should mint 3 NFTs during the public sale ", async function () {
    const price = ethers.utils.parseEther("0.003").mul(3);
    const overrides = {
      value: price,
    };

    await this.deployedContract
      .connect(this.addr1)
      .publicMint(this.addr1.address, 3, overrides);
    let result = await this.deployedContract.tokensOfOwner(this.addr1.address);
    expect(result.length).to.equal(4);
  });

  it("totalSupply should be equal to 5"),
    async function () {
      expect(await this.deployedContract.totalSupply()).to.equal(5);
    };

  it("Should not mint 3 NFTs during the public sale ", async function () {
    const price = ethers.utils.parseEther("0.003");
    const overrides = {
      value: price,
    };

    await expect(
      this.deployedContract
        .connect(this.addr1)
        .publicMint(this.addr1.address, 1, overrides)
    ).to.be.revertedWith("You can only mint 3 NFTs during the public sale");
  });

  it("Should not mint 1NFT during the public sale if not enougth ethers are provided", async function () {
    const price = ethers.utils.parseEther("0.002");
    const overrides = {
      value: price,
    };

    await expect(
      this.deployedContract
        .connect(this.addr2)
        .publicMint(this.addr2.address, 1, overrides)
    ).to.be.revertedWith("Not enought funds");
  });

  it("Should mint 3 NFTs during the public sale ", async function () {
    const price = ethers.utils.parseEther("0.003").mul(3);
    const overrides = {
      value: price,
    };

    await this.deployedContract
      .connect(this.addr2)
      .publicMint(this.addr2.address, 3, overrides);
    let result = await this.deployedContract.tokensOfOwner(this.addr2.address);
    expect(result.length).to.equal(4);
  });

  it("totalSupply should be equal to 8"),
    async function () {
      expect(await this.deployedContract.totalSupply()).to.equal(8);
    };

  /**Gift tests */

  it("Should not be possible to gift if the public sale is not finished", async function () {
    await expect(
      this.deployedContract.gift(this.addr1.address, 1)
    ).to.be.revertedWith("Gift is after public sale");
  });

  it("Should change saleStartTime", async function () {
    const timestamp = parseInt(new Date().getTime() / 1000) - 50 * 3600;
    await this.deployedContract.setSaleStartTime(timestamp);
    expect(await this.deployedContract.saleStartTime()).to.equal(timestamp);
  });

  it("Should be possible to gift 1 NFT to an user", async function () {
    let balanceAddr3BeforeGift = await this.deployedContract.balanceOf(
      this.addr3.address
    );
    await this.deployedContract.gift(this.addr3.address, 1);
    let balanceAddr3AfterGift = await this.deployedContract.balanceOf(
      this.addr3.address
    );
    expect(balanceAddr3BeforeGift).to.be.lt(balanceAddr3AfterGift);
  });

  it("totalSupply should be equal to 9"),
    async function () {
      expect(await this.deployedContract.totalSupply()).to.equal(9);
    };

  it("Should be possible to gift 1 NFT to an user", async function () {
    let balanceAddr3BeforeGift = await this.deployedContract.balanceOf(
      this.addr3.address
    );
    await this.deployedContract.connect(this.owner).gift(this.addr3.address, 1);
    let balanceAddr3AfterGift = await this.deployedContract.balanceOf(
      this.addr3.address
    );
    expect(balanceAddr3BeforeGift).to.be.lt(balanceAddr3AfterGift);
  });

  it("totalSupply should be equal to 10"),
    async function () {
      expect(await this.deployedContract.totalSupply()).to.equal(10);
    };

  //   it("Should not be possible to gift 1 NFT to an user because max supply is exceeded", async function () {
  //     await expect(
  //       this.deployedContract.gift(this.addr3.address, 1)
  //     ).to.be.revertedWith("MAX supply exceeded");
  //   });

  /* Paused tests */

  it("Should  be possible to pause  the contract ", async function () {
    await this.deployedContract.setPause(true);
    expect(await this.deployedContract.isPaused()).to.equal(true);
  });

  // unpause
  it("Should  be possible to unpause  the contract ", async function () {
    await this.deployedContract.setPause(false);
    expect(await this.deployedContract.isPaused()).to.equal(false);
  });
  // not possible to gift NFT if contract is paused
  // it("Should not be possible to gift 1 NFT to an user because contract is paused", async function () {
  //     await expect(
  //         this.deployedContract.gift(this.addr3.address, 1)
  //     ).to.be.revertedWith("Contract is paused");
  // });

  // possible to get the tokenURI of a NFT
  it("Should be possible to get the tokenURI of a NFT", async function () {
    let tokenURI = await this.deployedContract.tokenURI(1);
    expect(tokenURI).to.equal("ipfs://CID/1.json");
  });

  // possible to change the baseURI
  it("Should be possible to change the baseURI", async function () {
    await this.deployedContract.setBaseURI("ipfs://newCID/");
    let baseURI = await this.deployedContract.baseURI();
    expect(baseURI).to.equal("ipfs://newCID/");
  });
  // change the merkle root
  it("Should be possible to change the merkle root", async function () {
    let newMerkleRoot =
      "0x887a9d7f2b1fca2ff8c07e1e02d906bc2cda73495a8da7494165adcd81875154";
    await this.deployedContract.setMerkleRoot(newMerkleRoot);
    let merkleRoot = await this.deployedContract.merkleRoot();
    expect(merkleRoot).to.equal(newMerkleRoot);
  });
  // change the merkle root if owner
  it("Should be possible to change the merkle root if owner", async function () {
    let newMerkleRoot =
      "0x887a9d7f2b1fca2ff8c07e1e02d906bc2cda73495a8da7494165adcd81875154";
    await this.deployedContract
      .connect(this.owner)
      .setMerkleRoot(newMerkleRoot);
    let merkleRoot = await this.deployedContract.merkleRoot();
    expect(merkleRoot).to.equal(newMerkleRoot);
  });

  // not possible to change the merkle root if not owner
  it("Should not be possible to change the merkle root if not owner", async function () {
    let newMerkleRoot =
      "0x887a9d7f2b1fca2ff8c07e1e02d906bc2cda73495a8da7494165adcd81875154";
    await expect(
      this.deployedContract.connect(this.addr1).setMerkleRoot(newMerkleRoot)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  // release the gains of the collection
  it("Should be possible to release the gains of the collection", async function () {
    let lastBalanceAddr1 = await this.deployedContract.balanceOf(
      this.addr1.address
    );
    let lastBalanceAddr2 = await this.deployedContract.balanceOf(
      this.addr2.address
    );
    let lastBalanceAddr3 = await this.deployedContract.balanceOf(
      this.addr3.address
    );

    await this.deployedContract.releaseAll();

    let newBalanceAddr1 = await this.addr1.getBalance();
    let newBalanceAddr2 = await this.addr2.getBalance();
    let newBalanceAddr3 = await this.addr3.getBalance();

    expect(newBalanceAddr1).to.be.gt(lastBalanceAddr1);
    expect(newBalanceAddr2).to.be.gt(lastBalanceAddr2);
    expect(newBalanceAddr3).to.be.gt(lastBalanceAddr3);
  });
});
