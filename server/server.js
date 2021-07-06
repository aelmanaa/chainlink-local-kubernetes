const express = require('express')
const http = require('http')
const Consumer = require('../build/contracts/Consumer.json')
const Operator = require('@chainlink/contracts/abi/v0.7/Operator.json')
const LinkToken = require('@chainlink/contracts/abi/v0.4/LinkToken.json')
const addr = require('../config/addr.json')
const Web3 = require('web3')

if(!addr.network.host || !addr.network.port) throw new Error('Host or port empty')
const url = 'ws://' + addr.network.host + ':' + addr.network.port



let timestampToHumanFormat = (timestamp) => {
    // timestamp from ETH is in seconds
    let date = new Date(timestamp * 1000)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

let parseEvent = async (contractName, log, web3) => {
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


let web3ws = new Web3(new Web3.providers.WebsocketProvider(url))
let consumer = new web3ws.eth.Contract(Consumer.abi, addr.consumerAddress)
let operator = new web3ws.eth.Contract(Operator.compilerOutput.abi, addr.operatorAddress)
let linkToken = new web3ws.eth.Contract(LinkToken.compilerOutput.abi, addr.linkTokenAddress)

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




