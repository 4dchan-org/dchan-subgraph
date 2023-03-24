import {
    assert,
    describe,
    test,
    clearStore,
    beforeEach
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { handleMessage } from "../src/relay"
import { createMessageEvent } from "./relay-utils"
import { boardId } from "../src/internal/board"

describe("Board create", () => {
    beforeEach(() => {
        clearStore()
    })

    test("create board (valid)", () => {
        assert.entityCount("Board", 0)
        assert.entityCount("BoardJanny", 0)

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:create","data": {"name": "d","title": "dchan"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)
        handleMessage(newMessageEvent)

        assert.entityCount("Board", 1)
        assert.entityCount("BoardJanny", 1)
    })

    test("create board (invalid name)", () => {
        assert.entityCount("Board", 0)
        assert.entityCount("BoardJanny", 0)

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:create","data": {"name": "12345678whoopsiwenttoolong","title": "dchan"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)
        handleMessage(newMessageEvent)

        assert.entityCount("Board", 0)
        assert.entityCount("BoardJanny", 0)
    })

    test("create board (invalid title)", () => {
        assert.entityCount("Board", 0)
        assert.entityCount("BoardJanny", 0)

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:create","data": {"name": "d","title": "${"dchan".repeat(100)}"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)
        handleMessage(newMessageEvent)

        assert.entityCount("Board", 0)
        assert.entityCount("BoardJanny", 0)
    })

    test("create board with nsfw flag", () => {
        assert.entityCount("Board", 0)
        assert.entityCount("BoardJanny", 0)

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:create","data": {"name": "d","title": "dchan","nsfw": true}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)
        handleMessage(newMessageEvent)

        assert.entityCount("Board", 1)
        assert.entityCount("BoardJanny", 1)

        assert.fieldEquals(
            "Board",
            boardId(newMessageEvent),
            "isNsfw",
            "true"
        )
    })

    test("create board with thread lifetime", () => {
        assert.entityCount("Board", 0)
        assert.entityCount("BoardJanny", 0)

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:create","data": {"name": "d","title": "dchan","thread_lifetime": 86400}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)
        handleMessage(newMessageEvent)

        assert.entityCount("Board", 1)
        assert.entityCount("BoardJanny", 1)

        assert.fieldEquals(
            "Board",
            boardId(newMessageEvent),
            "threadLifetime",
            "86400"
        )
    })
})
