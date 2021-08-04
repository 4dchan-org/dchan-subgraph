const Relay = artifacts.require('./Relay.sol')

module.exports = async function(deployer) {
  const relay = await Relay.deployed()

  await relay.message("QmXvawLsbC9UCGugyofxuRiTAfPyy2LwSvgHa6Y4Uw1oun")
}
