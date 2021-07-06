const Consumer = artifacts.require('Consumer')
const addr = require('../config/addr.json')
const jobId = process.env.ETH256_JOBID || ''


if (!jobId) throw new Error('Node address not provided!')


module.exports = async callback => {
  try {
    const consumer = await Consumer.deployed()
    const tx = await consumer.requestEthereumPrice(addr.operatorAddress, jobId)

    console.log(JSON.stringify(tx))
    callback(tx.tx)
  } catch (err) {
    callback(err)
  }
}