const FluxAggregator = require('@chainlink/contracts/abi/v0.6/FluxAggregator.json')
const { getNetworkName } = require('../utils')
const conf = require('../../config/addr.json')


module.exports = async callback => {
  try {
    const networkName = getNetworkName()
    const addr = conf[networkName]
    if (!addr) throw new Error(`List of addresses for ${networkName} is null`)

    const aggregatorAddress = addr.fluxAggregatorAddress
    if (!aggregatorAddress) throw new Error(`aggregatorAddress not found in ${addr} `)
    const aggregator = new web3.eth.Contract(FluxAggregator.compilerOutput.abi, aggregatorAddress)

    const aggregatorMethods = aggregator.methods

    const minSubmissionValue = await aggregatorMethods.minSubmissionValue().call()
    const maxSubmissionValue = await aggregatorMethods.maxSubmissionValue().call()

    console.log(`minSubmissionValue is ${minSubmissionValue}`)
    console.log(`maxSubmissionValue is ${maxSubmissionValue}`)

    const value = await aggregatorMethods.latestRoundData().call()
    console.log(value)
    callback(value)
  } catch (err) {
    callback(err)
  }
}



