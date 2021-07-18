
const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config()

const infuraKey = process.env.INFURA_API_KEY || ""
const mnemonicPhrase = process.env.MNEMONIC || ""

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    kovan: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: mnemonicPhrase
        },
        providerOrUrl: `wss://kovan.infura.io/ws/v3/${infuraKey}`
      }),
      network_id: 42,     // Kovan's id
      gas: 6300000

    },
    rinkeby: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: mnemonicPhrase
        },
        providerOrUrl: `wss://rinkeby.infura.io/ws/v3/${infuraKey}`
      }),
      network_id: 4,     // Rinkeby's id
      gas: 6300000

    }
  },
  compilers: {
    solc: {
      version: '0.8.0',
    },
  },
}