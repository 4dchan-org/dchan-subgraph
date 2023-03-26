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
import { Ban, UserBan } from "../generated/schema"
import { userBanId } from "../src/internal/user_ban"
import { locateUserFromId, userId } from "../src/internal/user"
import { banId } from "../src/internal/ban"

describe("User ban", () => {
    beforeEach(() => {
        clearStore()
        claimAdmin()
    })

    test("ban user", () => {
        let from = Address.fromString("0x0000000000000000000000000000000000000000")
        let target = Address.fromString("0x0000000000000000000000000000000000000001")
        let user = locateUserFromId(userId(target))!
        let jsonMessage = `{"ns": "dchan","v": 0,"op": "user:ban","data": {"id": "${userId(target)}", "reason": "spam", "seconds": 1000}}`
        let newMessageEvent = createMessageEvent(from, jsonMessage)
        
        assert.notInStore("Ban", banId(newMessageEvent))
        assert.notInStore("UserBan", userBanId(user.id))

        handleMessage(newMessageEvent)

        let ban = Ban.load(banId(newMessageEvent))!
        let userBan = UserBan.load(userBanId(user.id))!

        assert.fieldEquals("Ban", ban.id, "expiresAt", "1001")
        assert.fieldEquals("Ban", ban.id, "reason", "spam")
        assert.fieldEquals("Ban", ban.id, "from", userId(from))
        assert.fieldEquals("UserBan", userBan.id, "user", user.id)
        assert.fieldEquals("UserBan", userBan.id, "ban", ban.id)
    })
})