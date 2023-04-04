// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

/**
 * @author: Marjorie N. for blockchain school Alyra
 * Date: 2023
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ERC721A.sol";
import "./ERC721AQueryable.sol";

contract NFTCryptoAstro is ERC721A, ERC721AQueryable, Ownable, PaymentSplitter {
    using Strings for uint256;

    enum Step {
        Before,
        whitelistSale,
        Between,
        PublicSale,
        Finished,
        Reveal
    }

    Step public step;

    uint private constant MAX_SUPPLY = 500;
    uint private constant MAX_GIFT = 5;
    uint private constant MAX_WHITELIST = 125;
    uint private constant MAX_PUBLIC = 370;
    uint private constant MAX_SUPPLY_MINUS_GIFT = MAX_SUPPLY - MAX_GIFT;

    uint private constant PRICE_WHITELIST_MINT = 0.002 ether;
    uint private constant PRICE_PUBLIC_MINT = 0.003 ether;
    uint public saleStartTime = 1681311600;
    bytes32 public merkleRoot;
    string public baseURI;

    mapping(address => uint) amountNFTperWalletWhitelistSale;
    mapping(address => uint) amountNFTperWalletPublicSale;
    uint private constant MAX_PER_ADDRESS_DURING_WHITELIST_MINT = 1;
    uint private constant MAX_PER_ADDRESS_DURING_PUBLIC_MINT = 3;

    uint private teamlength;
    bool public isPaused = false;

    address[] private _team = [0xEcb86fEf51e5c603d0514d904b79AB40158BA67A];

    uint[] private _teamShares = [100];

    constructor(
        bytes32 _merkleRoot,
        string memory _baseURI
    ) ERC721A("Crypto Astro", "CA") PaymentSplitter(_team, _teamShares) {
       
        merkleRoot = _merkleRoot;
        baseURI = _baseURI;
        teamlength = _team.length;
    }

    /**
     * @notice Modifier that run the function only if the contract is not paused
     */
    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    /**
     * @notice Allows to pause/unpause the smart contract
     *
     * @param _ispaused true or false if we want to pause or unpause the smart contract
     */

    function setPause(bool _ispaused) external onlyOwner {
        isPaused = _ispaused;
    }

    /**
     * @notice Allows to change the starting date of the sale
     * @param _saleStartTime the new date of the sale
     */

    function setSaleStartTime(uint _saleStartTime) external onlyOwner {
        saleStartTime = _saleStartTime;
    }

    /**
     * @notice Allows to change the baseURI of the NFTs
     * @param _baseURI the new baseURI (reveal or not reveal)
     */

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    /**
     * @notice Allows to change the merkleRoot
     * @param _merkleRoot the new merkleRoot
     */

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    /**
     * @notice Allows to get the step of the sale
     */

    function getStep() public view returns (Step actualStep) {
        if (block.timestamp < saleStartTime) {
            return Step.Before;
        }
        if (
            block.timestamp >= saleStartTime &&
            block.timestamp < saleStartTime + 12 hours
        ) {
            return Step.whitelistSale;
        }
        if (
            block.timestamp >= saleStartTime + 12 hours &&
            block.timestamp < saleStartTime + 24 hours
        ) {
            return Step.Between;
        }
        if (
            block.timestamp >= saleStartTime + 24 hours &&
            block.timestamp < saleStartTime + 48 hours
        ) {
            return Step.PublicSale;
        }
        if (
            block.timestamp >= saleStartTime + 48 hours &&
            block.timestamp < saleStartTime + 216 hours
        ) {
            return Step.Finished;
        }
        if (block.timestamp >= saleStartTime + 216 hours) {
            return Step.Reveal;
        }
    }

    /**
     * @notice Check if the address is in the whitelist
     * @param _account the address to check
     * @param _proof the proof of the address in the merkle tree
     * @return true if the address is in the whitelist or false if not
     */

    function isWhitelisted(
        address _account,
        bytes32[] calldata _proof
    ) internal view returns (bool) {
        return
            MerkleProof.verify(
                _proof,
                merkleRoot,
                keccak256(abi.encodePacked(_account))
            );
    }

    /**
     * @notice get the token uri of a NFT by his id
     * @param _tokenId the id of the NFT to get the token uri of it
     * @return the token uri of the NFT by his id
     * @dev the token uri is the link to the image of the NFT
     */

    function tokenURI(
        uint256 _tokenId
    ) public view override(ERC721A, IERC721A) returns (string memory) {
        //override permet de modifier la fonction tokenURI de la librairie ERC721A
        require(_exists(_tokenId), "ERC721A: URI query for nonexistent token");
        // ipfs:// CID// token id // .json
        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    /**
     * @notice Release the gains of the team
     * @dev the team can release their gains only if the sale is finished
     */
    function releaseAll() external {
        for (uint i = 0; i < teamlength; i++) {
            release(payable(payee(i)));
        }
    }

    /**
     * @notice not alloring receiving ethers outside of the mint function
     * @dev the contract is not payable
     */
    receive() external payable override {
        revert("only if you mint");
    }

    /**
     * @notice Mint function for the whitelist sale
     * @param _account the address of the person who wants to mint
     * @param _quantity the quantity of NFTs the person wants to mint
     * @param _proof the proof of the address in the merkle tree
     */

    function whiteListMint(
        address _account,
        uint _quantity,
        bytes32[] calldata _proof
    ) external payable whenNotPaused {
        require(
            getStep() == Step.whitelistSale,
            "Whitelist sale is not active"
        );
        require(isWhitelisted(_account, _proof), "You are not whitelisted");
        require(
            amountNFTperWalletWhitelistSale[msg.sender] + _quantity <=
                MAX_PER_ADDRESS_DURING_WHITELIST_MINT,
            "You can only mint 1 NFT during the whitelist sale"
        );
        require(
            totalSupply() + _quantity <= MAX_WHITELIST,
            "MAX supply exceeded"
        );
        require(
            msg.value >= PRICE_WHITELIST_MINT * _quantity,
            "Not enought funds"
        );
        amountNFTperWalletWhitelistSale[msg.sender] += _quantity;

        _safeMint(_account, _quantity); // mint les NFTs  à l'adresse de la personne
    }

    /**
     * @notice Mint function for the public sale
     * @param _account the address of the person who wants to mint
     * @param _quantity  Amount  of  Nft to  mint
     */

    function publicMint(
        address _account,
        uint _quantity
    ) external payable whenNotPaused {
        require(getStep() == Step.PublicSale, "Public sale is not active");
        require(
            amountNFTperWalletPublicSale[msg.sender] + _quantity <=
                MAX_PER_ADDRESS_DURING_PUBLIC_MINT,
            "You can only mint 3 NFTs during the public sale"
        );
        require(
            totalSupply() + _quantity <= MAX_SUPPLY_MINUS_GIFT,
            "MAX supply exceeded"
        );
        require(
            msg.value >= PRICE_PUBLIC_MINT * _quantity,
            "Not enought funds"
        );
        amountNFTperWalletPublicSale[msg.sender] += _quantity;
        _safeMint(_account, _quantity);
    }

    /**
     * @notice Allows to gift NFTs (owner only)
     * @param _to  Address  of  the  receiver
     * @param _quantity  Amount  of  Nft to  mint
     */

    function gift(
        address _to,
        uint _quantity
    ) external onlyOwner whenNotPaused {
        require(getStep() > Step.PublicSale, "Gift is after public sale"); 
        require(totalSupply() + _quantity <= MAX_SUPPLY, "MAX supply exceeded"); 
        _safeMint(_to, _quantity); 
    }
}
