import { Address } from "@graphprotocol/graph-ts";
import { boardId } from "../src/internal/board";
import { boardJannyId } from "../src/internal/board_janny";
import { postId } from "../src/internal/post";
import { threadId } from "../src/internal/thread";
import { userId } from "../src/internal/user";
import { handleMessage } from "../src/relay";
import { createMessageEvent } from "./relay-utils";

export function claimAdmin(): void {
  const from = Address.fromString("0x0000000000000000000000000000000000000000")
  const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "admin:claim","data": {}}`
  const newMessageEvent = createMessageEvent(from, jsonMessage)
  handleMessage(newMessageEvent)
}

export function createBoard(name: string, title: string): string {
  const from = Address.fromString("0x0000000000000000000000000000000000000000")
  const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "board:create","data": {"name": "${name}", "title": "${title}"}}`
  const newMessageEvent = createMessageEvent(from, jsonMessage)
  handleMessage(newMessageEvent)
  return boardId(newMessageEvent)
}

export function createThread(boardId: string, comment: string): string {
  const from = Address.fromString("0x0000000000000000000000000000000000000000")
  const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "post:create","data": {"board": "${boardId}", "comment": "${comment}"}}`
  const newMessageEvent = createMessageEvent(from, jsonMessage)
  handleMessage(newMessageEvent)
  return threadId(newMessageEvent)
}

export function createPost(threadId: string, comment: string): string {
  const from = Address.fromString("0x0000000000000000000000000000000000000000")
  const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "post:create","data": {"thread": "${threadId}", "comment": "${comment}"}}`
  const newMessageEvent = createMessageEvent(from, jsonMessage)
  handleMessage(newMessageEvent)
  return postId(newMessageEvent)
}

export function jannyGrant(boardId: string, to: Address): string {
  const from = Address.fromString("0x0000000000000000000000000000000000000000")
  const jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "janny:grant","data": {"board": "${boardId}", "user": "${userId(to)}"}}`
  const newMessageEvent = createMessageEvent(from, jsonMessage)
  handleMessage(newMessageEvent)
  return boardJannyId(userId(from), boardId)
}