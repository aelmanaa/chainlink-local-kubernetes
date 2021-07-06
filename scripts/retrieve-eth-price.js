const Consumer = artifacts.require('Consumer')

module.exports = async callback => {
  try {
    const consumer = await Consumer.deployed()
    const currentPrice = await consumer.currentPrice.call()

    console.log(`Current price is ${currentPrice/100} USD/ETH`)
    callback(currentPrice)
  } catch (err) {
    callback(err)
  }
}