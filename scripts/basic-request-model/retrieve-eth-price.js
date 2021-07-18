const Consumer = artifacts.require('Consumer')
const conf = require('../../config/addr.json')
const { getNetworkName } = require('../utils')

module.exports = async callback => {
  try {
    const networkName = getNetworkName()
    const addr = conf[networkName]
    if (!addr) throw new Error(`List of addresses for ${networkName} is null`)
    const consumerAddress = addr.consumerAddress
    if (!consumerAddress) throw new Error(`Consumer address not found in ${addr}`)

    const consumer = new web3.eth.Contract(Consumer.abi, consumerAddress)
    const consumerMethods = consumer.methods
    const currentPrice = await consumerMethods.currentPrice().call()

    console.log(`Current price is ${currentPrice/100} USD/ETH`)
    callback(currentPrice)
  } catch (err) {
    callback(err)
  }
}