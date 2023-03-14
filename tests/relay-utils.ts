import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { Message } from "../generated/Relay/Relay"

export function createMessageEvent(
  from: Address,
  jsonMessage: string
): Message {
  let messageEvent = changetype<Message>(newMockEvent())

  messageEvent.parameters = new Array()

  messageEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  messageEvent.parameters.push(
    new ethereum.EventParam(
      "jsonMessage",
      ethereum.Value.fromString(jsonMessage)
    )
  )

  return messageEvent
}
