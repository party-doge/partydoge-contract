/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("dotenv").config();
 require('@nomiclabs/hardhat-waffle');
 require('@nomiclabs/hardhat-solhint');
 require('solidity-coverage');
 require("@nomiclabs/hardhat-etherscan");

 module.exports = {
   defaultNetwork: "hardhat",
   solidity: {
     version: "0.8.4",
     settings: {
       optimizer: {
         enabled: true,
         runs: 200
       }
     }
   },
   networks: {
     hardhat: {
       gas: "auto",
       gasPrice: "auto",
       gasMultiplier: 20,
       blockGasLimit: 90000000000000,
       forking: {
         url: process.env.RPC_NODE_URL,
         blockNumber: 11997864,
       }
     },
     kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/pJBLLNa2QC_Mfg1qoDDVp3rWsqAM9jNM`,
      accounts: {
        mnemonic: process.env.MNEMONIC
      },
      chainId: 42,
       timeout: 20000000
    },
     binance: {
       accounts: {
         mnemonic: process.env.MNEMONIC
       },
       url: "https://bsc-dataseed.binance.org/",
       chainId: 56,
       timeout: 20000000
     },

     bsctestnet: {
        accounts: {
          mnemonic: process.env.MNEMONIC
        },
        url: "https://data-seed-prebsc-1-s1.binance.org:8545",
        chainId: 97,
        timeout: 20000000
     },

     matic: {
       accounts: {
         mnemonic: process.env.MNEMONIC
       },
       url: "https://rpc-mainnet.maticvigil.com/",
       chainId: 137,
       timeout: 20000000
     },
   },

   etherscan: {
     apiKey: process.env.ETHERSCAN_API_KEY
   },

   mocha: {
     timeout: 2000000
   }
 };
