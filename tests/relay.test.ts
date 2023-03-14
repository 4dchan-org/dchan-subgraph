import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { Message } from "../generated/schema"
import { Message as MessageEvent } from "../generated/Relay/Relay"
import { handleMessage } from "../src/relay"
import { createMessageEvent } from "./relay-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let from = Address.fromString("0x0000000000000000000000000000000000000001")
    let jsonMessage = "Example string value"
    let newMessageEvent = createMessageEvent(from, jsonMessage)
    handleMessage(newMessageEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Message created and stored", () => {
    assert.entityCount("Message", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Message",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "from",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Message",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "jsonMessage",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
