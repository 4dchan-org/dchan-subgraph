const Relay = artifacts.require('./Relay.sol')

module.exports = async function(deployer) {
  const relay = await Relay.deployed()

  console.log('Account address:', relay.address)

  await relay.message("QmUZEscDKJDxppu9hsNqPsB9rWLdcVJEdybqAAc8HQguyC")
}
