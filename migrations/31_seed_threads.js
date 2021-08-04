const Relay = artifacts.require('./Relay.sol')

module.exports = async function(deployer) {
  const relay = await Relay.deployed()

  await relay.message("QmbLABWtk8vVs355peWUFfYBajU2cFGakYqq2iK3vY7YKt")
}
