let Relay = artifacts.require("./Relay.sol");

module.exports = async function(deployer) {
  let relay = await Relay.deployed();

  // Lock and then unlock

  let {receipt: boardReceipt} = await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "board:create",
      data: {
        name: "keyed",
        title: "What the fuck does keyed even mean anyway?",
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
        comment: "Lockable thread",
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
        comment: "Reply before lock",
        from: "",
        thread: threadId,
      },
    })
  );

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "thread:lock",
      data: {
          id: threadId
      },
    })
  );

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "post:create",
      data: {
        comment: "Reply after lock, should not appear",
        from: "",
        thread: threadId,
      },
    })
  );

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "thread:unlock",
      data: {
          id: threadId
      },
    })
  );

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "post:create",
      data: {
        comment: "Reply after unlock",
        from: "",
        thread: threadId,
      },
    })
  );

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "board:lock",
      data: {
        id: boardId
      },
    })
  );

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "post:create",
      data: {
        comment: "Reply after board lock, should not appear",
        from: "",
        thread: threadId,
      },
    })
  );

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "post:create",
      data: {
        board: boardId,
        comment: "Thread after board lock, should not appear",
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

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "board:unlock",
      data: {
        id: boardId
      },
    })
  );

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "post:create",
      data: {
        comment: "Reply after board unlock",
        from: "",
        thread: threadId,
      },
    })
  );

  await relay.message(
    JSON.stringify({
      ns: "dchan",
      v: 0,
      op: "post:create",
      data: {
        board: boardId,
        comment: "Thread after board unlock",
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
};
