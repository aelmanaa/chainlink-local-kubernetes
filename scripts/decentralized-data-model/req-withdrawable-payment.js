const FluxAggregator = require('@chainlink/contracts/abi/v0.6/FluxAggregator.json')
const { getNetworkName, toEther } = require('../utils')
const conf = require('../../config/addr.json')

const nodeAddressEnv = process.env.ORACLE_NODE_ADDRESS || ''


if (!nodeAddressEnv) throw new Error('Node address not provided!')
const nodeAddresses = nodeAddressEnv.split(',')

module.exports = async callback => {
  try {

    const networkName = getNetworkName()
    const addr = conf[networkName]
    if (!addr) throw new Error(`List of addresses for ${networkName} is null`)

    const aggregatorAddress = addr.fluxAggregatorAddress
    if (!aggregatorAddress) throw new Error(`aggregatorAddress not found in ${addr} `)
    const aggregator = new web3.eth.Contract(FluxAggregator.compilerOutput.abi, aggregatorAddress)

    const aggregatorMethods = aggregator.methods

    let withdrawablePayment 
    for (let nodeAddress of nodeAddresses){
      withdrawablePayment = await aggregatorMethods.withdrawablePayment(nodeAddress).call()
      console.log(`withdrawablePayment for oracle ${nodeAddress} is ${toEther(withdrawablePayment)} LINK`)
    }

    callback('')
  } catch (err) {
    callback(err)
  }
}



