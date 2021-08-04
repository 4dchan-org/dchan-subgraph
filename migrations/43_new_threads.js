const Relay = artifacts.require('./Relay.sol')

module.exports = async function(deployer) {
  const relay = await Relay.deployed()

  await relay.message("QmWcdgkPgv5SxWWv65C4973gHfD6WPU7LfBTdkdHiAmHCN")
}
