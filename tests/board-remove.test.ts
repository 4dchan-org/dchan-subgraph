import {
    assert,
    describe,
    test,
    beforeEach,
    clearStore
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { handleMessage } from "../src/relay"
import { createMessageEvent } from "./relay-utils"
import { createBoard } from "./helpers"

describe("Board remove", () => {
    beforeEach(() => {
        clearStore()
    })

    test("remove board (by creator)", () => {
        let boardId = createBoard("d", "dchan")

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:remove","data": {"id": "${boardId}"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("Board", boardId, "id", boardId)

        handleMessage(newMessageEvent)

        assert.notInStore("Board", boardId)
    })

    test("remove board (by non-janny, non-creator)", () => {
        let boardId = createBoard("d", "dchan")

        const from = Address.fromString("0x0000000000000000000000000000000000000001")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:remove","data": {"id": "${boardId}"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("Board", boardId, "id", boardId)

        handleMessage(newMessageEvent)

        assert.fieldEquals("Board", boardId, "id", boardId)
    })

    test("remove board (invalid board id)", () => {
        let boardId = createBoard("d", "dchan")

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:remove","data": {"id": "123456"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("Board", boardId, "id", boardId)

        handleMessage(newMessageEvent)

        assert.fieldEquals("Board", boardId, "id", boardId)
    })

    // test("remove board (by janny)", () => {
    //     let boardId = createBoard("d", "dchan")
    //     let jannyId = Address.fromString("0x0000000000000000000000000000000000000001")

    //     store.set("BoardJanny", `${jannyId.toHexString()}-${boardId}`, "grantedAtBlock", "1")
    //     store.set("BoardJanny", `${jannyId.toHexString()}-${boardId}`, "grantedAt", "1000")

    //     const from = jannyId
    //     const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:remove","data": {"id": "${boardId}"}}`
    //     const newMessageEvent = createMessageEvent(from, jsonMessage)

    //     assert.fieldEquals("Board", boardId, "id", boardId)

    //     handleMessage(newMessageEvent)

    //     assert.notInStore("Board", boardId)
    // })
})
