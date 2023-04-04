require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");

// const { INFURA, INFURA_MAINNET, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;
const { INFURA_MUMBAI, POLYGONSCAN_API_KEY, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // cout moins de gas mais plus long à compiler (déploiement + cher)
      },
    },
  },
  path: {
    artifacts: "./artifacts", // fichiers json avec code abi
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // goerli: {
    //   url: INFURA,
    //   accounts: [`0x${PRIVATE_KEY}`],
    // },
    // mainnet: {
    //   url: INFURA_MAINNET,
    //   accounts: [`0x${PRIVATE_KEY}`],
    // },
    mumbai: {
      url: INFURA_MUMBAI,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  gasReporter: {
    currency: "EUR",
    gasPrice: 21,
    enabled: true,
  },

  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
};
