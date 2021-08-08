const Relay = artifacts.require('./Relay.sol')

module.exports = async function (deployer) {
    const relay = await Relay.deployed()

    console.log('Account address:', relay.address)

    const { tx: boardTx } = await relay.message(JSON.stringify({
        "ns": "dchan",
        "v": 0,
        "op": "board:create",
        "data": {
            "name": "dchan",
            "title": "dchan.network"
        }
    }))

    const { tx: threadTx } = await relay.message(JSON.stringify({
        "ns": "dchan",
        "v": 0,
        "op": "post:create",
        "data": {
            "board": boardTx,
            "comment": "Testing in production and no one can stop me",
            "file": {
                "ipfs": {
                    "hash": "QmQMqBZsAdjcFJDr5fBQmBc7BnV8xFHsSsZADaQTrUqypi"
                },
                "name": "Screenshot 2021-08-06 215458.png",
                "byte_size": 7705
            },
            "from": {
                "name": ""
            },
            "subject": ""
        }
    }))

    await relay.message(JSON.stringify({ "ns": "dchan", "v": 0, "op": "post:create", "data": { "comment": "Reply", "file": { "ipfs": { "hash": "QmQMqBZsAdjcFJDr5fBQmBc7BnV8xFHsSsZADaQTrUqypi" }, "name": "Screenshot 2021-08-06 215458.png", "byte_size": 7705 }, "from": { "name": "" }, "thread": threadTx } }))
}
