const Relay = artifacts.require('./Relay.sol')

module.exports = async function(deployer) {
  await deployer.deploy(Relay)
}
