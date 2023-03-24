import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { handleMessage } from "../src/relay"
import { createMessageEvent } from "./relay-utils"
import { claimAdmin } from "./helpers"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0
// https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test
// https://thegraph.com/docs/en/developer/matchstick/#asserts

describe("Admin grant", () => {
  beforeEach(() => {
    clearStore()

    claimAdmin()
  })

  afterAll(() => {
  })

  test("new grant (authorized)", () => {
    assert.entityCount("Admin", 2)

    const from = Address.fromString("0x0000000000000000000000000000000000000000")
    const jsonMessage = `{"ns": "dchan","v": 0,"op": "admin:grant","data": {"hex_address":"0x0000000000000000000000000000000000000001"}}`
    const newMessageEvent = createMessageEvent(from, jsonMessage)
    handleMessage(newMessageEvent)

    assert.entityCount("Admin", 3)
  })

  test("already existing grant", () => {
    assert.entityCount("Admin", 2)

    const from = Address.fromString("0x0000000000000000000000000000000000000000")
    const jsonMessage = `{"ns": "dchan","v": 0,"op": "admin:grant","data": {"hex_address":"0x0000000000000000000000000000000000000000"}}`
    const newMessageEvent = createMessageEvent(from, jsonMessage)
    handleMessage(newMessageEvent)

    assert.entityCount("Admin", 2)
  })

  test("invalid grant", () => {
    assert.entityCount("Admin", 2)

    const from = Address.fromString("0x0000000000000000000000000000000000000000")
    const jsonMessage = `{"ns": "dchan","v": 0,"op": "admin:grant","data": {"hex_address":"0x5n33d"}}`
    const newMessageEvent = createMessageEvent(from, jsonMessage)
    handleMessage(newMessageEvent)

    assert.entityCount("Admin", 2)
  })

  test("no admins? 😢", () => {
    clearStore();
  
    assert.entityCount("Admin", 0);

    const from = Address.fromString("0x0000000000000000000000000000000000000000")
    const jsonMessage = `{"ns": "dchan","v": 0,"op": "admin:grant","data": {"hex_address":"0x0000000000000000000000000000000000000000"}}`
    const newMessageEvent = createMessageEvent(from, jsonMessage)
    handleMessage(newMessageEvent)

    assert.entityCount("Admin", 0)
  })
})
