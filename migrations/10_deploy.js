const Relay = artifacts.require('./Relay.sol')
const dChanProxy = artifacts.require('./upgrades/dChanProxy.sol')
const dChanToken = artifacts.require('./token/dChanToken.sol')

module.exports = async function(deployer, network, accounts) {

  // Deploy the token contract first
  await deployer.deploy(dChanToken);
  const token = await dChanToken.deployed()

  // Use that address to deploy the relay contract
  await deployer.deploy(Relay);
  const relay = await Relay.deployed()

  // Deploy the proxy contract last, and set the implementation to the relay contract
  await deployer.deploy(dChanProxy, relay.address, accounts[0]);
  const proxy = await dChanProxy.deployed()
  await proxy.acceptUpgrade()

  console.log("Current Proxy Implementation Address: " + (await proxy.implementation.call()))
}
