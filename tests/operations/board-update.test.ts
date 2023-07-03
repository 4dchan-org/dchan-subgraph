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

describe("Board update", () => {
    beforeEach(() => {
        clearStore()
    })

    test("update board", () => {
        let boardId = createBoard("d", "4dchan.org")

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "board:update","data": {"id": "${boardId}", "title": "New Board Title", "nsfw": true, "thread_lifetime": 300}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("Board", boardId, "title", "4dchan.org")
        assert.fieldEquals("Board", boardId, "isNsfw", "false")
        assert.fieldEquals("Board", boardId, "threadLifetime", "null")

        handleMessage(newMessageEvent)

        assert.fieldEquals("Board", boardId, "title", "New Board Title")
        assert.fieldEquals("Board", boardId, "isNsfw", "true")
        assert.fieldEquals("Board", boardId, "threadLifetime", "300")
    })

    test("update board (invalid board id)", () => {
        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "board:update","data": {"id": "123456", "title": "New Board Title", "nsfw": true, "thread_lifetime": 300}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        handleMessage(newMessageEvent)

        assert.notInStore("Board", "123456")
    })

    test("update board (by non-janny, non-creator)", () => {
        let boardId = createBoard("d", "4dchan.org")

        const from = Address.fromString("0x0000000000000000000000000000000000000001")
        const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "board:update","data": {"id": "${boardId}", "title": "New Board Title", "nsfw": true, "thread_lifetime": 300}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("Board", boardId, "title", "4dchan.org")
        assert.fieldEquals("Board", boardId, "isNsfw", "false")
        assert.fieldEquals("Board", boardId, "threadLifetime", "null")

        handleMessage(newMessageEvent)

        assert.fieldEquals("Board", boardId, "title", "4dchan.org")
        assert.fieldEquals("Board", boardId, "isNsfw", "false")
        assert.fieldEquals("Board", boardId, "threadLifetime", "null")
    })
})
