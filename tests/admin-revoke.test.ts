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
  
  // Tests structure (matchstick-as >=0.5.0)
  // https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test
  // https://thegraph.com/docs/en/developer/matchstick/#asserts
  
  describe("Admin revoke", () => {
    beforeEach(() => {
      clearStore()
  
      const from = Address.fromString("0x0000000000000000000000000000000000000000")
      const jsonMessage = `{"ns": "dchan","v": 0,"op": "admin:claim","data": {}}`
      const newMessageEvent = createMessageEvent(from, jsonMessage)
      handleMessage(newMessageEvent)
    })
  
    test("revoke (authorized)", () => {
      assert.entityCount("Admin", 2)
  
      const from = Address.fromString("0x0000000000000000000000000000000000000000")
      const jsonMessage = `{"ns": "dchan","v": 0,"op": "admin:revoke","data": {"hex_address":"0x0000000000000000000000000000000000000000"}}`
      const newMessageEvent = createMessageEvent(from, jsonMessage)
      handleMessage(newMessageEvent)
  
      assert.entityCount("Admin", 1)
    })
  
    test("invalid revoke", () => {
      assert.entityCount("Admin", 2)
  
      const from = Address.fromString("0x0000000000000000000000000000000000000000")
      const jsonMessage = `{"ns": "dchan","v": 0,"op": "admin:revoke","data": {"hex_address":"5n33d"}}`
      const newMessageEvent = createMessageEvent(from, jsonMessage)
      handleMessage(newMessageEvent)
  
      assert.entityCount("Admin", 2)
    })
  
    test("revoke not authorized", () => {
      assert.entityCount("Admin", 2)
  
      const from = Address.fromString("0x0000000000000000000000000000000000000001")
      const jsonMessage = `{"ns": "dchan","v": 0,"op": "admin:revoke","data": {"hex_address":"0x0000000000000000000000000000000000000000"}}`
      const newMessageEvent = createMessageEvent(from, jsonMessage)
      handleMessage(newMessageEvent)
  
      assert.entityCount("Admin", 2)
    })
  })