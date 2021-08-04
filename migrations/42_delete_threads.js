const Relay = artifacts.require('./Relay.sol')

module.exports = async function(deployer) {
  const relay = await Relay.deployed()

  await relay.message("QmcddQkh1SV9iCNhv7PYq5TkZZGSUpb1fo9qGwSGtk4ChE")
}
