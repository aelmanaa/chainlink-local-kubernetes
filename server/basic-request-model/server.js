const express = require('express')
const http = require('http')
const Consumer = require('../../build/contracts/Consumer.json')
const Operator = require('@chainlink/contracts/abi/v0.7/Operator.json')
const LinkToken = require('@chainlink/contracts/abi/v0.4/LinkToken.json')
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
const consumerAddress = addr.consumerAddress
const operatorAddress = addr.operatorAddress


if (!linkTokenAddress) throw new Error(`linkTokenAddress not found in network ${networkName}`)
if (!consumerAddress) throw new Error(`consumerAddress not found in network ${networkName}`)
if (!operatorAddress) throw new Error(`operatorAddress not found in network ${networkName}`)



let web3ws = new Web3(new Web3.providers.WebsocketProvider(url))
let consumer = new web3ws.eth.Contract(Consumer.abi, consumerAddress)
let operator = new web3ws.eth.Contract(Operator.compilerOutput.abi, operatorAddress)
let linkToken = new web3ws.eth.Contract(LinkToken.compilerOutput.abi, linkTokenAddress)

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

consumer.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest'
})
    .then(async (logs) => {
        for (let log of logs) {
            await parseEvent('Consumer', log, web3ws)
        }

    })

operator.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest'
})
    .then(async (logs) => {
        for (let log of logs) {
            await parseEvent('Operator', log, web3ws)
        }

    })


consumer.events.allEvents().on('data', async (log) => {
    await parseEvent('Consumer', log, web3ws)
}).on('error', (error) => {
    console.log('received event error: ', error)
})

operator.events.allEvents().on('data', async (log) => {
    await parseEvent('Operator', log, web3ws)
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
server.listen(3000)




