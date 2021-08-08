const Relay = artifacts.require('./Relay.sol')

module.exports = async function(deployer) {
  const relay = await Relay.deployed()

  // Broken requests
}
