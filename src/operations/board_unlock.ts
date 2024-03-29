import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { User } from "../../generated/schema"
import { ensureString } from "../ensure"
import { isBoardJanny } from "../internal/board_janny"
import { eventId } from "../id"
import { loadBoardFromId } from "../internal/board"

export function boardUnlock(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    let maybeBoardId = ensureString(data.get("id"))
    if(!maybeBoardId) {
        log.warning("Invalid board unlock request: {}", [evtId])

        return false
    }

    let boardId = maybeBoardId as string
    log.info("Unlocking board: {}", [boardId])
    
    let board = loadBoardFromId(boardId)
    if (!board) {
        log.warning("Board {} not found", [boardId])

        return false
    }

    if((board.createdBy != user.id) && !isBoardJanny(user.id, boardId)) {
        log.warning("User {} is not janny of {}, skipping {}", [user.id, boardId, evtId])

        return false
    }

    if(!board.isLocked) {
        log.warning("Board {} not locked, skipping {}", [boardId, evtId])

        return false
    }
    
    board.isLocked = false
    board.save()

    log.info("Board unlocked: {}", [boardId])
    
    return true
}