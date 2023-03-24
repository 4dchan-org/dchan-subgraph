import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { Board, User } from "../../generated/schema"
import { ensureString } from "../ensure"
import { scorePenalty } from "../score"
import { eventId } from "../id"
import { createBoardReport } from "../internal/board_report"
import { loadBoardFromId } from "../internal/board"

export function boardReport(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    let maybeBoardId = ensureString(data.get("id"))
    let reason = ensureString(data.get("reason"))
    if (!maybeBoardId) {
        log.warning("Invalid board report request: {}", [evtId])

        return false
    }

    let boardId = maybeBoardId as string
    log.debug("Reported board: {}", [boardId])

    let board = loadBoardFromId(boardId)
    if (!board) {
        log.warning("Board {} not found, skipping {}", [boardId, evtId])

        return false
    }
    board.score = scorePenalty(board.score)
    board.save()

    createBoardReport(message, user, board as Board, reason ? reason as string : "")

    return true
}