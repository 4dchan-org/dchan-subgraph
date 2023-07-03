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
import { locateUserFromId } from "../../src/internal/user"
import { boardJannyId } from "../../src/internal/board_janny"

describe("Janny revoke", () => {
    beforeEach(() => {
        clearStore()
        let boardId = createBoard("d", "4dchan.org")

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const to = Address.fromString("0x0000000000000000000000000000000000000001")
        const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "janny:grant","data": {"board": "${boardId}", "user": "${to.toHexString()}"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)
        const jannyId = to.toHexString() + ":" + boardId

        assert.notInStore("BoardJanny", jannyId)

        handleMessage(newMessageEvent)

        assert.fieldEquals("BoardJanny", jannyId, "user", to.toHexString())
    })

    test("revoke janny (by janny)", () => {
        let boardId = createBoard("d", "4dchan.org")

        const target = locateUserFromId("0x0000000000000000000000000000000000000001")!
        const jannyId = boardJannyId(target.id, boardId)

        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "janny:revoke","data": {"board": "${boardId}", "user": "${target.id}"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)
        
        assert.fieldEquals("BoardJanny", jannyId, "user", target.id)

        handleMessage(newMessageEvent)

        assert.notInStore("BoardJanny", jannyId)
    })

    test("revoke janny (by user)", () => {
        let boardId = createBoard("d", "4dchan.org")

        const target = locateUserFromId("0x0000000000000000000000000000000000000001")!
        let jannyId = boardJannyId(target.id, boardId)

        const from = Address.fromString("0x0000000000000000000000000000000000000002")
        const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "janny:revoke","data": {"board": "${boardId}", "user": "${target.id}"}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("BoardJanny", jannyId, "user", target.id)

        handleMessage(newMessageEvent)

        assert.fieldEquals("BoardJanny", jannyId, "user", target.id)
    })
})