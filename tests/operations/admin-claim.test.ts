import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { handleMessage } from "../../src/relay"
import { createMessageEvent } from "../relay-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0
// https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test
// https://thegraph.com/docs/en/developer/matchstick/#asserts

describe("Admin claim", () => {
  beforeEach(() => {
    clearStore()
  })

  afterAll(() => {
  })

  test("first claim", () => {
    assert.entityCount("Admin", 0)

    const from = Address.fromString("0x0000000000000000000000000000000000000000")
    const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "admin:claim","data": {}}`
    const newMessageEvent = createMessageEvent(from, jsonMessage)
    handleMessage(newMessageEvent)

    assert.entityCount("Admin", 2)
  })

  test("already claimed", () => {
    assert.entityCount("Admin", 0)

    const from = Address.fromString("0x0000000000000000000000000000000000000000")
    const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "admin:claim","data": {}}`
    const newMessageEvent = createMessageEvent(from, jsonMessage)
    handleMessage(newMessageEvent)

    assert.entityCount("Admin", 2)

    const from1 = Address.fromString("0x0000000000000000000000000000000000000001")
    const jsonMessage1 = `{"ns": "4dchan.org","v": 0,"op": "admin:claim","data": {}}`
    const newMessageEvent1 = createMessageEvent(from1, jsonMessage1)
    handleMessage(newMessageEvent1)

    assert.entityCount("Admin", 2)
  })
})
