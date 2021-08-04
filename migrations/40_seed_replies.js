const Relay = artifacts.require('./Relay.sol')

module.exports = async function(deployer) {
  const relay = await Relay.deployed()

  await relay.message("Qmea5C7QFP38ozGcP5GdE86LpuAMeJBmGXBMNLckpXXMdi")
  await relay.message("QmXV7eXA3EPRTQd5B2Dkab6o3apBurhz8EuULsJF5xCwZ5")
}
