let Relay = artifacts.require("./Relay.sol");

module.exports = async function(deployer) {
  let relay = await Relay.deployed();

  // Addiction/removal

  let {receipt: boardReceipt} = await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "board:create",
      data: {
        name: "sneed",
        title: "Seed & Feed",
      },
    })
  );
  let boardId = `${boardReceipt.transactionHash}-${boardReceipt.transactionIndex}`

  let {receipt: threadReceipt} = await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "post:create",
      data: {
        board: boardId,
        comment: "Removable thread",
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

  let {receipt: postReceipt} = await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "post:create",
      data: {
        comment: "Removable reply",
        from: "",
        thread: threadId,
      },
    })
  );
  let postId = `${postReceipt.transactionHash}-${postReceipt.transactionIndex}`

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "post:remove",
      data: {
          id: postId
      },
    })
  );

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "thread:remove",
      data: {
          id: threadId
      },
    })
  );

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "board:remove",
      data: {
          id: boardId
      },
    })
  );
};
