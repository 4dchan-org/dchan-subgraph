const Relay = artifacts.require("./Relay.sol");

module.exports = async function(deployer) {
  const relay = await Relay.deployed();

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "admin:claim",
      data: {},
    })
  );
};
