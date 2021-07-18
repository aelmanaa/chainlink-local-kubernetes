const FluxAggregator = require('@chainlink/contracts/abi/v0.6/FluxAggregator.json')
const { getNetworkName } = require('../utils')
const conf = require('../../config/addr.json')

const nodeAddressEnv = process.env.ORACLE_NODE_ADDRESS || ''


if (!nodeAddressEnv) throw new Error('Node address not provided!')

module.exports = async callback => {
    try {

        const nodeAddresses = nodeAddressEnv.split(',')


        const networkName = getNetworkName()
        const addr = conf[networkName]
        if (!addr) throw new Error(`List of addresses for ${networkName} is null`)


        const accounts = await web3.eth.getAccounts()
        const [owner] = accounts
        const aggregatorAddress = addr.fluxAggregatorAddress
        if (!aggregatorAddress) throw new Error(`aggregatorAddress not found in ${addr} `)

        const aggregator = new web3.eth.Contract(FluxAggregator.compilerOutput.abi, aggregatorAddress)
        const aggregatorMethods = aggregator.methods
        const gas = 3000000

        // prepare data for changeOracles
        const removed = [] // no oracles to remove

        const added = nodeAddresses
        const addedAdmins = Array.from(added, x => owner) // set 1st account as owners for all oracles

        console.log(`Added oracle nodes ${added}`)
        console.log(`Added oracle nodes admins ${addedAdmins}`)

        const minSubmissions = '1'
        const maxSubmissions = added.length
        const restartDelay = '0'

        const tx = await aggregatorMethods.changeOracles(removed, added, addedAdmins, minSubmissions, maxSubmissions, restartDelay).send({ from: owner, gas: gas })

        callback(tx.transactionHash)
    } catch (err) {
        callback(err)
    }
}



