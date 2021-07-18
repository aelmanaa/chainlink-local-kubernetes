const PriceConsumer = artifacts.require('PriceConsumer')
const { getNetworkName  } = require('../utils')
const conf = require('../../config/addr.json')


module.exports = async callback => {
  try {
    const networkName = getNetworkName()
    const addr = conf[networkName]
    if (!addr) throw new Error(`List of addresses for ${networkName} is null`)

    const priceConsumerAddress = addr.priceConsumerAddress
    if (!priceConsumerAddress) throw new Error(`priceConsumerAddress not found in ${addr}`)

    const priceConsumer = new web3.eth.Contract(PriceConsumer.abi, priceConsumerAddress)
    const priceConsumerMethods = priceConsumer.methods

    const lastPrice = await priceConsumerMethods.getThePrice().call()

    //8 decimals
    console.log(`Current price is ${lastPrice/100000000} USD/ETH`)
    callback(lastPrice)

  } catch (err) {
    callback(err)
  }
}