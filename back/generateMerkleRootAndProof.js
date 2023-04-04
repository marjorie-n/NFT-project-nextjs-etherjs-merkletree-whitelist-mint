// script qui permet de générer un merkle root et une preuve pour certaine addresse qui déclenche mint

const { MerkleTree } = require("merkletreejs"); // permet de générer un merkle root et une preuve
const keccak256 = require("keccak256"); // permet de hasher les données
const tokens = require("./tokens.json"); // liste des tokens (adresses) qui déclenche mint

// convertir addresses en feuille de merkle tree
async function main() {
  let tab = [];
  tokens.map((token) => {
    tab.push(token.address);
  });
  const leaves = tab.map((address) => keccak256(address));
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const root = tree.getHexRoot();
  const leaf = keccak256("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
  const proof = tree.getHexProof(leaf);
  console.log("root", root);
  console.log("proof", proof);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
