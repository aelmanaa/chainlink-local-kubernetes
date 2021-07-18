const { getNetworkName } = require('./utils')

module.exports = async callback => {
    try {

        console.log(`networkName is ${getNetworkName()}`)

        callback('finish')
    } catch (err) {
        callback(err)
    }
}