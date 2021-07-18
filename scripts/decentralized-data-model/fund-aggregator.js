const LinkTokenInterface = require('@chainlink/contracts/abi/v0.8/LinkTokenInterface.json')
const { getNetworkName, toWei, toEther } = require('../utils')
const conf = require('../../config/addr.json')

/**
 * Send some links to Flux aggregator. 
 * FluxAggregator contract needs Link in order to pay Oracles for their work
 */

module.exports = async callback => {
  try {
    const networkName = getNetworkName()
    const addr = conf[networkName]
    if (!addr) throw new Error(`List of addresses for ${networkName} is null`)
    const payment = toWei('100')
    const gas = 3000000
    
    const accounts = await web3.eth.getAccounts()
    const [owner] = accounts
   
    const tokenAddress = addr.linkTokenAddress
    const aggregatorAddress = addr.fluxAggregatorAddress
    if (!tokenAddress || !aggregatorAddress) throw new Error(`One of the required addresses in ${addr} not found`)
    // const token = await LinkTokenInterface.at(tokenAddress)
    const token = new web3.eth.Contract(LinkTokenInterface.compilerOutput.abi, tokenAddress)
    const tokenMethods = token.methods

    console.log(`Funding aggregator contract:  ${aggregatorAddress} of ${payment} LINK`)
    // Fund consumer contract in Links in order to be able to call Oracle contract 
    // call transferAndCall in order to trigger onTokenTransfer
    //const tx = await token.transfer(aggregatorAddress, payment)
    const tx = await tokenMethods.transferAndCall(aggregatorAddress, payment, []).send({ from: owner, gas: gas })
  
    console.log(`Balance of aggregator contract ${aggregatorAddress} is ${toEther(await tokenMethods.balanceOf(aggregatorAddress).call())} LINK`)
    callback(tx.transactionHash)
  } catch (err) {
    callback(err)
  }
}