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
import { claimAdmin } from "./helpers"
import { userBanId } from "../src/internal/user_ban"
import { locateUserFromId, userId } from "../src/internal/user"
import { banId } from "../src/internal/ban"

describe("User unban", () => {
    beforeEach(() => {
        clearStore()
        claimAdmin()
    })

    test("unban user", () => {
        let from = Address.fromString("0x0000000000000000000000000000000000000000")
        let target = Address.fromString("0x0000000000000000000000000000000000000001")
        let user = locateUserFromId(userId(target))!

        let jsonMessage = `{"ns": "dchan","v": 0,"op": "user:ban","data": {"id": "${userId(target)}", "reason": "spam", "seconds": 1000}}`
        let newMessageEvent = createMessageEvent(from, jsonMessage)
        handleMessage(newMessageEvent)
        
        assert.fieldEquals("Ban", banId(newMessageEvent), "id", banId(newMessageEvent))
        assert.fieldEquals("UserBan", userBanId(user.id), "id", userBanId(user.id))

        jsonMessage = `{"ns": "dchan","v": 0,"op": "user:unban","data": {"id": "${userId(target)}"}}`
        newMessageEvent = createMessageEvent(from, jsonMessage)
        handleMessage(newMessageEvent)

        assert.fieldEquals("Ban", banId(newMessageEvent), "expiresAt", newMessageEvent.block.timestamp.toString())
    })
})
