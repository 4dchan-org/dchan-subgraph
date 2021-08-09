const Relay = artifacts.require("./Relay.sol");

module.exports = async function(deployer) {
  const relay = await Relay.deployed();

  var {receipt: boardReceipt} = await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "board:create",
      data: {
        name: "dchan",
        title: "dchan.network",
      },
    })
  );

  let boardId = `${boardReceipt.transactionHash}-${boardReceipt.transactionIndex}`
  var {receipt: threadReceipt} = await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "post:create",
      data: {
        board: boardId,
        comment: "Testing in production and no one can stop me",
        file: {
          ipfs: {
            hash: "QmQMqBZsAdjcFJDr5fBQmBc7BnV8xFHsSsZADaQTrUqypi",
          },
          name: "Screenshot 2021-08-06 215458.png",
          byte_size: 7705,
        },
        name: "",
        subject: "",
      },
    })
  );

  let threadId = `${threadReceipt.transactionHash}-${threadReceipt.transactionIndex}`
  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "post:create",
      data: {
        comment: "Test reply",
        from: "",
        thread: threadId,
      },
    })
  );
};
