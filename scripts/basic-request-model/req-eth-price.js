const Consumer = artifacts.require('Consumer')
const conf = require('../../config/addr.json')
const { getNetworkName } = require('../utils')
const jobId = process.env.ETH256_JOBID || ''



module.exports = async callback => {
  try {
    if (!jobId) throw new Error('Node address not provided!')
    const networkName = getNetworkName()
    const addr = conf[networkName]
    const gas = 3000000
    if (!addr) throw new Error(`List of addresses for ${networkName} is null`)
    const consumerAddress = addr.consumerAddress
    const operatorAddress = addr.operatorAddress
    if (!consumerAddress || !operatorAddress) throw new Error(`Operator address or Consumer address not found in ${addr}`)

    const consumer = new web3.eth.Contract(Consumer.abi, consumerAddress)
    const consumerMethods = consumer.methods

    const accounts = await web3.eth.getAccounts()
    const owner = accounts[0]
    const tx = await consumerMethods.requestEthereumPrice(operatorAddress, jobId).send({ from: owner, gas: gas })

    callback(tx.transactionHash)
  } catch (err) {
    callback(err)
  }
}