const Relay = artifacts.require('./Relay.sol')

module.exports = async function(deployer) {
  const relay = await Relay.deployed()

  // Broken thread requests
  
  await relay.message("QmTiEE7fUJvNeEc3pzhRbP9mBAFx4MYefQGoEwDj5Gzoou")
  await relay.message("QmU9EnMeD8sBAURiir2D858PTmbmXsiVrKWLQtCzJoiYk8")
}
