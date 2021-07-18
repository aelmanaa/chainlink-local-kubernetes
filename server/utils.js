require('dotenv').config()

const infuraKey = process.env.INFURA_API_KEY
if(!infuraKey) throw new Error('InfuraKey not found!')



const getNetworkName = () => {
    let networkParamIndex = -1
    process.argv.forEach((val, index, array) => {
        if (val === '--network') {
            networkParamIndex = index
        }
    })
    if (networkParamIndex < 0) throw new Error('--network not found')
    if ((networkParamIndex + 1) > process.argv.length) throw new Error('networkName not in the argument list')
    return process.argv[networkParamIndex + 1]
}

const getEndpoint = () => {
    const networkName = getNetworkName()
    switch (networkName) {
        case 'ganache':
            return 'ws://127.0.0.1:8545'
        case 'rinkeby':
            return `wss://rinkeby.infura.io/ws/v3/${infuraKey}`
        case 'kovan':
            return `wss://kovan.infura.io/ws/v3/${infuraKey}`
        default:
            throw new Error(`Network ${networkName} not supported`)
    }
}

const timestampToHumanFormat = (timestamp) => {
    // timestamp from ETH is in seconds
    let date = new Date(timestamp * 1000)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const parseEvent = async (contractName, log, web3) => {
    try {
        let blockNumber = log.blockNumber
        let block = await web3.eth.getBlock(blockNumber)
        let timestamp = block.timestamp
        let timestampInHumanFormat = timestampToHumanFormat(timestamp)
        let returnValues = log.returnValues

        console.log(`Event received. Timestamp : ${timestampInHumanFormat} - Contract: ${contractName} - Event: ${log.event} - TransactionHash: ${log.transactionHash} - Return values: ${JSON.stringify(returnValues)}`)

    } catch (error) {
        console.log('error while parsing event', error)
    }
}

module.exports = {
    timestampToHumanFormat,
    parseEvent,
    getEndpoint,
    getNetworkName
}