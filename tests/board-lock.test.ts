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

describe("Board lock", () => {
    beforeEach(() => {
        clearStore()
    })

    test("lock board (by creator)", () => {
        let boardId = createBoard("d", "dchan")

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:lock","data": {"id": "${boardId}"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("Board", boardId, "isLocked", "false")

        handleMessage(newMessageEvent)

        assert.fieldEquals("Board", boardId, "isLocked", "true")
    })

    // test("lock board (by janny)", () => {
        let boardId = createBoard("d", "dchan")

    //     const from = janny
    //     const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:lock","data": {"id": "${boardId}"}}`
    //     const newMessageEvent = createMessageEvent(from, jsonMessage)

    //     assert.fieldEquals("Board", boardId, "isLocked", "false")

    //     handleMessage(newMessageEvent)

    //     assert.fieldEquals("Board", boardId, "isLocked", "true")
    // })

    test("lock board (by non-janny, non-creator)", () => {
        let boardId = createBoard("d", "dchan")

        const from = Address.fromString("0x0000000000000000000000000000000000000001")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:lock","data": {"id": "${boardId}"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("Board", boardId, "isLocked", "false")

        handleMessage(newMessageEvent)

        assert.fieldEquals("Board", boardId, "isLocked", "false")
    })

    test("lock board (invalid board id)", () => {
        let boardId = createBoard("d", "dchan")

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:lock","data": {"id": "123456"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("Board", boardId, "isLocked", "false")

        handleMessage(newMessageEvent)

        assert.fieldEquals("Board", boardId, "isLocked", "false")
    })

    test("lock board (already locked)", () => {
        let boardId = createBoard("d", "dchan")

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:lock","data": {"id": "${boardId}"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("Board", boardId, "isLocked", "false")

        handleMessage(newMessageEvent)

        assert.fieldEquals("Board", boardId, "isLocked", "true")

        handleMessage(newMessageEvent)

        assert.fieldEquals("Board", boardId, "isLocked", "true")
    })
})
