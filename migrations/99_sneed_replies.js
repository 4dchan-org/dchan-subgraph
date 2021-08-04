const Relay = artifacts.require('./Relay.sol')

module.exports = async function(deployer) {
  const relay = await Relay.deployed()

  // Broken replies

  await relay.message("QmNYCuq3VhKciKb4LSCnniYQgyzfo56WbgF4rbTqm00000")
  await relay.message("lmao get rekt nerd")
  await relay.message("QmZew2mcmDooT8YmpW8J3K34oVaCrUYGwSFFc9iqAHLeJa")
  await relay.message("QmXmXNtbDExYa9XoBpt67L1S6yT87S83x4fL49zf22GhNZ")
  await relay.message("QmRGvzvjEaL9wCVZyzgYPfbhxyoU9fD8ho3GnSyey44F7V")
}
