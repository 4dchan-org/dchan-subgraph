const Relay = artifacts.require("./Relay.sol");
const dChanProxy = artifacts.require('./upgrades/dChanProxy.sol')

module.exports = async function(deployer, network, accounts) {
  const relay = await Relay.at((await dChanProxy.deployed()).address);

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "admin:claim",
      data: {},
    }), {from: accounts[2]}   // Cannot send from the admin account (accounts[0])
  );
};
