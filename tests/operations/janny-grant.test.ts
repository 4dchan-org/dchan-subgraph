import {
    assert,
    describe,
    test,
    beforeEach,
    clearStore
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { handleMessage } from "../../src/relay"
import { createMessageEvent } from "../relay-utils"
import { createBoard } from "../helpers"

describe("Janny grant", () => {
    beforeEach(() => {
        clearStore()
    })

    test("grant janny (by janny)", () => {
        let boardId = createBoard("d", "4dchan.org")

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const to = Address.fromString("0x0000000000000000000000000000000000000001")
        const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "janny:grant","data": {"board": "${boardId}", "user": "${to.toHexString()}"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)
        const jannyId = to.toHexString() + ":" + boardId

        assert.notInStore("BoardJanny", jannyId)

        handleMessage(newMessageEvent)

        assert.fieldEquals("BoardJanny", jannyId, "user", to.toHexString())
        assert.fieldEquals("BoardJanny", jannyId, "board", boardId)
    })

    test("grant janny (by user)", () => {
        let boardId = createBoard("d", "4dchan.org")

        const from = Address.fromString("0x0000000000000000000000000000000000000001")
        const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "janny:grant","data": {"board": "${boardId}", "user": "${from.toHexString()}"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)
        const jannyId = from.toHexString() + ":" + boardId

        assert.notInStore("BoardJanny", jannyId)

        handleMessage(newMessageEvent)

        assert.notInStore("BoardJanny", jannyId)
    })
})
