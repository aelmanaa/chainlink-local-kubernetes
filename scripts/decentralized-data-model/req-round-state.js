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


    const availableFunds = await aggregatorMethods.availableFunds().call()

    console.log(`FluxAggregator ${aggregatorAddress} has availableFunds ${toEther(availableFunds)} LINK`)

    let value
    for (let nodeAddress of nodeAddresses) {
      value = await aggregatorMethods.oracleRoundState(nodeAddress, '0').call()
      console.log(`Value for node ${nodeAddress}`, value)
    }

    callback(value)
  } catch (err) {
    callback(err)
  }
}



