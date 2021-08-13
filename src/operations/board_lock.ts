import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { eventId } from "../id";
import { isBoardJanny } from "../internal/board_janny";

export function boardLock(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let boardId = ensureString(data.get("id"))
    let evtId = eventId(message)
    if(boardId == null) {
        log.warning("Invalid board lock request: {}", [evtId]);

        return false
    }

    log.info("Locking board: {}", [boardId]);
    
    let board = Board.load(boardId)
    if (board == null) {
        log.warning("Board {} not found", [boardId]);

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