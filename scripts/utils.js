
const web3 = require('web3')

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

const toWei = (amount) => {
    return web3.utils.toWei(amount.toString(), 'ether')
}

const toEther = (amount) => {
    return web3.utils.fromWei(amount, 'ether')
}

module.exports = {
    getNetworkName,
    toWei,
    toEther
}