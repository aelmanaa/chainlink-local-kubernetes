const { toWei } = require('../utils')
const nodeAddressEnv = process.env.ORACLE_NODE_ADDRESS || ''

module.exports = async callback => {
  try {
    if (!nodeAddressEnv) throw new Error('Node address not provided!')
    const nodeAddresses = nodeAddressEnv.split(',')


    const accounts = await web3.eth.getAccounts()
    const owner = accounts[0]

    //Fund nodes
    const fund = toWei('0.5', 'ether')

    for(let nodeAddress of nodeAddresses){
        console.log(`Send money ${fund} WEI from Default account ${owner} to Node ${nodeAddress}`)
        console.log(await web3.eth.sendTransaction({ from: owner, to: nodeAddress, value: fund }))
    }

    
    callback('Nodes funded')
  } catch (err) {
    callback(err)
  }
}