require("@nomiclabs/hardhat-etherscan");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const tokens = require("../tokens.json");

const hre = require("hardhat");

async function main() {
  let tab = [];
  tokens.map((token) => {
    tab.push(token.address);
  });
  const leaves = tab.map((address) => keccak256(address));
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const root = tree.getHexRoot();

  // hidden images
  let baseURI = "ipfs://QmbvKVn3fqbqHxZbbbCzmqZNaQi6798J1zgRLmX1NaQX2s/";

  const NFT = await hre.ethers.getContractFactory("NFTCryptoAstro");
  const nft = await NFT.deploy(root, baseURI);

  await nft.deployed();

  console.log("NFTCryptoAstro deployed to:", nft.address);
  console.log("Merkle root:" + root + "- baseURI:" + baseURI);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
