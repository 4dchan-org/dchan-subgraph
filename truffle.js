require('babel-register')
require('babel-polyfill')
const HDWalletProvider = require('truffle-hdwallet-provider')
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "ganache",
      port: 8545,
      network_id: '*',
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://ropsten.infura.io/v3/${process.env.ROPSTEN_INFURA_API_KEY}`
        )
      },
      network_id: '3',
    },
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.matic.today`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: '0.8'    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
}