const LinkTokenInterface = artifacts.require('LinkTokenInterface')
const Consumer = artifacts.require('Consumer')


// not very clean but we use a web3 utilities to convert to 100*10^8 as link as same number of decimals as ether
const payment =  web3.utils.toWei('100', 'ether')

module.exports = async callback => {
  try {
    const consumer = await Consumer.deployed()
    const tokenAddress = await consumer.getChainlinkToken()
    const token = await LinkTokenInterface.at(tokenAddress)
    console.log(`Funding consumer contract:  ${consumer.address} of ${payment} LINK`)
    // Fund consumer contract in Links in order to be able to call Oracle contract 
    const tx = await token.transfer(consumer.address, payment)
    console.log(`Balance of consumer contract ${consumer.address} is ${await token.balanceOf(consumer.address)} LINK`)
    callback(tx.tx)
  } catch (err) {
    callback(err)
  }
}