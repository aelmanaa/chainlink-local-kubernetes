// truffle migruffle migrate --f 2 --network ganache

const { AggregatorProxy } = require('@chainlink/contracts/truffle/v0.7/AggregatorProxy')
const { FluxAggregator } = require('@chainlink/contracts/truffle/v0.6/FluxAggregator')
const PriceConsumer = artifacts.require('PriceConsumer')
const conf = require('../config/addr.json')



const fs = require('fs')

module.exports = async (deployer, network, [defaultAccount]) => {
    // Token contract has normally already been deployed by 1_deploy.js
    const addr = conf[network]
    if(!addr) throw new Error(`Configuration for ${network} not found`)
    const linkTokenAddress = addr.linkTokenAddress
    if (!linkTokenAddress) throw new Error('linkTokenAddress cannot be empty.Please run the 1st migration script')
    FluxAggregator.setProvider(deployer.provider)
    AggregatorProxy.setProvider(deployer.provider)
    try {
        // FluxAggregator
        const validatorAddress = '0x0000000000000000000000000000000000000000'
        // not very clean but we use a web3 utilities to convert to 1*10^8 as link as same number of decimals as ether
        const paymentAmount = web3.utils.toWei('1', 'ether')
        const timeout = '10'
        const minSubmissionValue = '100000000000'
        const maxSubmissionValue = '500000000000'
        const decimals = '8'
        const description = 'ETH / USD'
        await deployer.deploy(FluxAggregator, linkTokenAddress,
            paymentAmount, timeout, validatorAddress, minSubmissionValue, maxSubmissionValue,
            decimals, description, { from: defaultAccount })
        await deployer.deploy(AggregatorProxy, FluxAggregator.address, { from: defaultAccount })

        // PriceConsumer
        await deployer.deploy(PriceConsumer, AggregatorProxy.address, { from: defaultAccount })

      

        let newAddr = {
            ...addr,
            fluxAggregatorAddress: FluxAggregator.address,
            aggregatorProxyAddress: AggregatorProxy.address,
            priceConsumerAddress: PriceConsumer.address
        }
        console.log(`Link address is ${linkTokenAddress}`)
        console.log(`FluxAggregator address is ${FluxAggregator.address}`)
        console.log(`AggregatorProxy address is ${AggregatorProxy.address}`)
        console.log(`PriceConsumer address is ${PriceConsumer.address}`)

        const newConf = conf
        newConf[network] = newAddr
        fs.writeFileSync(__dirname + '/../config/addr.json', JSON.stringify(newConf, null, '\t'), 'utf-8')

    } catch (err) {
        console.error(err)
    }

}


