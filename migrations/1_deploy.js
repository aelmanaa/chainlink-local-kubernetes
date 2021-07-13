// truffle migrate --f 1 --network ganache

const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const { Operator } = require('@chainlink/contracts/truffle/v0.7/Operator')
const Consumer = artifacts.require('Consumer')
const fs = require('fs')


module.exports = async (deployer, network, [owner]) => {
  // Local (development) networks need their own deployment of the LINK
  // token and the Operator contract
  LinkToken.setProvider(deployer.provider)
  Operator.setProvider(deployer.provider)
  try {
    await deployer.deploy(LinkToken, { from: owner })
    await deployer.deploy(Operator, LinkToken.address, owner, { from: owner })
    await deployer.deploy(Consumer, LinkToken.address, { from: owner })

    let addr = {
      network: {
        host: deployer.networks[network].host,
        port: deployer.networks[network].port
      },
      linkTokenAddress: LinkToken.address,
      operatorAddress: Operator.address,
      consumerAddress: Consumer.address
    }
    console.log(`Link address is ${LinkToken.address}`)
    console.log(`Operator address is ${Operator.address}`)
    console.log(`Consumer address is ${Consumer.address}`)
    fs.writeFileSync(__dirname + '/../config/addr.json', JSON.stringify(addr, null, '\t'), 'utf-8')

  } catch (err) {
    console.error(err)
  }

}