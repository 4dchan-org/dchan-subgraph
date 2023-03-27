import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { User } from "../../generated/schema"
import { ensureString } from "../ensure"
import { eventId } from "../id"
import { loadBoardFromId } from "../internal/board"
import { isBoardJanny } from "../internal/board_janny"

export function boardLock(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let maybeBoardId = ensureString(data.get("id"))
    let evtId = eventId(message)
    if(!maybeBoardId) {
        log.warning("Invalid board lock request: {}", [evtId])

        return false
    }

    let boardId = maybeBoardId as string

    log.info("Locking board: {}", [boardId])
    
    let board = loadBoardFromId(boardId)
    if (!board) {
        log.warning("Board {} not found", [boardId])

        return false
    }

    if((board.createdBy != user.id) && !isBoardJanny(user.id, board.id)) {
        log.warning("User {} is not janny of {}, skipping {}", [user.id, boardId, evtId])

        return false
    }

    if(board.isLocked) {
        log.warning("Board {} already locked, skipping {}", [boardId, evtId])

        return false
    }
    
    board.isLocked = true
    board.save()

    log.info("Board locked: {}", [boardId])
    
    return true
}