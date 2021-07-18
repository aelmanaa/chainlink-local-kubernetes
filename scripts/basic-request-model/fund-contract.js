const LinkTokenInterface = require('@chainlink/contracts/abi/v0.8/LinkTokenInterface.json')
const { getNetworkName, toWei, toEther } = require('../utils')
const conf = require('../../config/addr.json')


module.exports = async callback => {
  try {
    // not very clean but we use a web3 utilities to convert to 100*10^8 as link as same number of decimals as ether
    const payment = toWei('100')
    const gas = 3000000
    const networkName = getNetworkName()
    const addr = conf[networkName]
    if (!addr) throw new Error(`List of addresses for ${networkName} is null`)

    const tokenAddress = addr.linkTokenAddress
    const consumerAddress = addr.consumerAddress
    if (!tokenAddress || !consumerAddress) throw new Error(`One of the required addresses in ${addr} not found`)
    const accounts = await web3.eth.getAccounts()
    const [owner] = accounts


    const token = new web3.eth.Contract(LinkTokenInterface.compilerOutput.abi, tokenAddress)
    const tokenMethods = token.methods
    console.log(`Funding consumer contract:  ${consumerAddress} of ${toEther(payment)}  LINK`)
    // Fund consumer contract in Links in order to be able to call Oracle contract 
    const tx = await tokenMethods.transfer(consumerAddress, payment).send({ from: owner, gas: gas })
    console.log(`Balance of consumer contract ${consumerAddress} is ${toEther(await tokenMethods.balanceOf(consumerAddress).call())}  LINK`)
    callback(tx.transactionHash)
  } catch (err) {
    callback(err)
  }
}