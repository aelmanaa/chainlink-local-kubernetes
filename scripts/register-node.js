const OperatorInterface = artifacts.require('OperatorInterface')
const addr = require('../config/addr.json')
const nodeAddress = process.env.ORACLE_NODE_ADDRESS || ''


if (!nodeAddress) throw new Error('Node address not provided!')
module.exports = async callback => {
  try {
    const accounts = await web3.eth.getAccounts()
    const defaultAccount = accounts[0]
    const operator = await OperatorInterface.at(addr.operatorAddress)
    console.log(`Set authorized senders ${[nodeAddress]} in Operator ${operator.address}`)
    let tx = await operator.setAuthorizedSenders([nodeAddress], { from: defaultAccount })
    const authorizedSenders = await operator.getAuthorizedSenders.call()
    console.log(`Get authorized senders: ${authorizedSenders}`)
    const fund = web3.utils.toWei('10', 'ether')
    console.log(`Send money ${fund} WEI from Default account ${defaultAccount} to Node ${nodeAddress}`)
    await web3.eth.sendTransaction({ from: defaultAccount, to: nodeAddress, value: fund })

    callback(tx.tx)
  } catch (err) {
    callback(err)
  }
}