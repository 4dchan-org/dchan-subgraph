import { Address } from "@graphprotocol/graph-ts";
import { boardId } from "../src/internal/board";
import { handleMessage } from "../src/relay";
import { createMessageEvent } from "./relay-utils";

export function claimAdmin(): void {
  const from = Address.fromString("0x0000000000000000000000000000000000000000")
  const jsonMessage = `{"ns": "dchan","v": 0,"op": "admin:claim","data": {}}`
  const newMessageEvent = createMessageEvent(from, jsonMessage)
  handleMessage(newMessageEvent)
}

export function createBoard(name: string, title: string): string {
  const from = Address.fromString("0x0000000000000000000000000000000000000000")
  const jsonMessage = `{"ns": "dchan","v": 0,"op": "board:create","data": {"name": "${name}", "title": "${title}"}}`
  const newMessageEvent = createMessageEvent(from, jsonMessage)
  handleMessage(newMessageEvent)
  return boardId(newMessageEvent)
}