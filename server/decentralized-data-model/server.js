const express = require('express')
const http = require('http')
const PriceConsumer = require('../../build/contracts/PriceConsumer.json')
const LinkToken = require('@chainlink/contracts/abi/v0.4/LinkToken.json')
const AggregatorProxy = require('@chainlink/contracts/abi/v0.7/AggregatorProxy.json')
const FluxAggregator = require('@chainlink/contracts/abi/v0.6/FluxAggregator.json')
const conf = require('../../config/addr.json')
const Web3 = require('web3')
let {
    parseEvent,
    getEndpoint,
    getNetworkName
} = require('../utils')



const url = getEndpoint()
if (!url) throw new Error('Host empty')


const networkName = getNetworkName()
const addr = conf[networkName]
if (!addr) throw new Error(`List of addresses for ${networkName} is null`)

const linkTokenAddress = addr.linkTokenAddress
const priceConsumerAddress = addr.priceConsumerAddress
const aggregatorProxyAddress = addr.aggregatorProxyAddress
const fluxAggregatorAddress = addr.fluxAggregatorAddress

if (!linkTokenAddress) throw new Error(`linkTokenAddress not found in network ${networkName}`)
if (!priceConsumerAddress) throw new Error(`priceConsumerAddress not found in network ${networkName}`)
if (!aggregatorProxyAddress) throw new Error(`aggregatorProxyAddress not found in network ${networkName}`)
if (!fluxAggregatorAddress) throw new Error(`fluxAggregatorAddress not found in network ${networkName}`)


let web3ws = new Web3(new Web3.providers.WebsocketProvider(url))
let linkToken = new web3ws.eth.Contract(LinkToken.compilerOutput.abi, linkTokenAddress)
let priceConsumer = new web3ws.eth.Contract(PriceConsumer.abi, priceConsumerAddress)
let aggregatorProxy = new web3ws.eth.Contract(AggregatorProxy.compilerOutput.abi, aggregatorProxyAddress)
let fluxAggregator = new web3ws.eth.Contract(FluxAggregator.compilerOutput.abi, fluxAggregatorAddress)


// 1st PRINT ALL PAST EVENTS

linkToken.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest'
})
    .then(async (logs) => {
        for (let log of logs) {
            await parseEvent('LinkToken', log, web3ws)
        }

    })



fluxAggregator.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest'
})
    .then(async (logs) => {
        for (let log of logs) {
            await parseEvent('FluxAggregator', log, web3ws)
        }

    })

aggregatorProxy.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest'
})
    .then(async (logs) => {
        for (let log of logs) {
            await parseEvent('AggregatorProxy', log, web3ws)
        }

    })

priceConsumer.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest'
})
    .then(async (logs) => {
        for (let log of logs) {
            await parseEvent('PriceConsumer', log, web3ws)
        }

    })


// then print future events
priceConsumer.events.allEvents().on('data', async (log) => {
    await parseEvent('PriceConsumer', log, web3ws)
}).on('error', (error) => {
    console.log('received event error: ', error)
})

aggregatorProxy.events.allEvents().on('data', async (log) => {
    await parseEvent('AggregatorProxy', log, web3ws)
}).on('error', (error) => {
    console.log('received event error: ', error)
})

fluxAggregator.events.allEvents().on('data', async (log) => {
    await parseEvent('FluxAggregator', log, web3ws)
}).on('error', (error) => {
    console.log('received event error: ', error)
})


linkToken.events.allEvents().on('data', async (log) => {
    await parseEvent('LinkToken', log, web3ws)
}).on('error', (error) => {
    console.log('received event error: ', error)
})

const app = express()
app.get('/api', (req, res) => {
    res.send({
        message: 'An API for use with your Dapp!'
    })
})

const server = http.createServer(app)
server.listen(3001)

