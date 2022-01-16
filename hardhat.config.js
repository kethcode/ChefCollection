
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  etherscan: {
    apiKey: process.env.POLYGON_ETHERSCAN_API_KEY,
  },
  networks: {
    rinkeby: {
      url: process.env.INFURA_RINKEBY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    "optimistic-kovan": {
      url: 'https://kovan.optimism.io',
      accounts: [process.env.PRIVATE_KEY],
    },
    polygon_mumbai: {
      url: process.env.ALCHEMY_POLYGON_MUMBAI_KEY,
      accounts: [process.env.PRIVATE_KEY]
   }
  },
};
