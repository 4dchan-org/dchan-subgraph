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
import { chanStatusId, isChanLocked } from "../src/internal/chan_status"
import { claimAdmin } from "./helpers"

describe("Chan unlock", () => {
    beforeEach(() => {
        clearStore();
        claimAdmin();

        const from = Address.fromString("0x0000000000000000000000000000000000000000");
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "chan:lock","data": {}}`;
        const newMessageEvent = createMessageEvent(from, jsonMessage);
        handleMessage(newMessageEvent)
    })

    test("unlock chan (by admin)", () => {
        const from = Address.fromString("0x0000000000000000000000000000000000000000")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "chan:unlock","data": {}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("ChanStatus", chanStatusId(newMessageEvent), "isLocked", "true")

        handleMessage(newMessageEvent)

        assert.fieldEquals("ChanStatus", chanStatusId(newMessageEvent), "isLocked", "false")
    })

    test("unlock chan (not locked)", () => {
        {
            const from = Address.fromString("0x0000000000000000000000000000000000000000")
            const jsonMessage = `{"ns": "dchan","v": 0,"op": "chan:unlock","data": {}}`
            const newMessageEvent = createMessageEvent(from, jsonMessage)

            assert.fieldEquals("ChanStatus", chanStatusId(newMessageEvent), "isLocked", "true")

            handleMessage(newMessageEvent)

            assert.fieldEquals("ChanStatus", chanStatusId(newMessageEvent), "isLocked", "false")
        }
        {
            const from = Address.fromString("0x0000000000000000000000000000000000000000")
            const jsonMessage = `{"ns": "dchan","v": 0,"op": "chan:unlock","data": {}}`
            const newMessageEvent = createMessageEvent(from, jsonMessage)

            assert.fieldEquals("ChanStatus", chanStatusId(newMessageEvent), "isLocked", "false")

            handleMessage(newMessageEvent)

            assert.fieldEquals("ChanStatus", chanStatusId(newMessageEvent), "isLocked", "false")
        }
    })

    test("unlock chan (not admin)", () => {
        const from = Address.fromString("0x0000000000000000000000000000000000000001")
        const jsonMessage = `{"ns": "dchan","v": 0,"op": "chan:unlock","data": {}}`
        const newMessageEvent = createMessageEvent(from, jsonMessage)

        assert.fieldEquals("ChanStatus", chanStatusId(newMessageEvent), "isLocked", "true")

        handleMessage(newMessageEvent)

        assert.fieldEquals("ChanStatus", chanStatusId(newMessageEvent), "isLocked", "true")
    })
})
