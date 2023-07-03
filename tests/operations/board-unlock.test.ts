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

describe("Board unlock", () => {
    beforeEach(() => {
        clearStore()
    })

    test("unlock board (by creator)", () => {
        let boardId = createBoard("d", "4dchan.org")
        let from = Address.fromString("0x0000000000000000000000000000000000000000")

        // lock board
        let lockJsonMessage = `{"ns": "4dchan.org","v": 0,"op": "board:lock","data": {"id": "${boardId}"}}`
        let lockMessageEvent = createMessageEvent(from, lockJsonMessage)
        handleMessage(lockMessageEvent)

        // assert board is locked
        assert.fieldEquals("Board", boardId, "isLocked", "true")

        // unlock board
        let unlockJsonMessage = `{"ns": "4dchan.org","v": 0,"op": "board:unlock","data": {"id": "${boardId}"}}`
        let unlockMessageEvent = createMessageEvent(from, unlockJsonMessage)
        handleMessage(unlockMessageEvent)

        // assert board is unlocked
        assert.fieldEquals("Board", boardId, "isLocked", "false")
    })

    test("unlock board (by non-janny, non-creator)", () => {
        let boardId = createBoard("d", "4dchan.org")

        let from = Address.fromString("0x0000000000000000000000000000000000000000")

        // lock board
        let lockJsonMessage = `{"ns": "4dchan.org","v": 0,"op": "board:lock","data": {"id": "${boardId}"}}`
        let lockMessageEvent = createMessageEvent(from, lockJsonMessage)
        handleMessage(lockMessageEvent)

        // assert board is locked
        assert.fieldEquals("Board", boardId, "isLocked", "true")

        // unlock board
        let unlockJsonMessage = `{"ns": "4dchan.org","v": 0,"op": "board:unlock","data": {"id": "${boardId}"}}`
        let unlockMessageEvent = createMessageEvent(Address.fromString("0x0000000000000000000000000000000000000001"), unlockJsonMessage)
        handleMessage(unlockMessageEvent)

        // assert board is still locked
        assert.fieldEquals("Board", boardId, "isLocked", "true")
    })
})