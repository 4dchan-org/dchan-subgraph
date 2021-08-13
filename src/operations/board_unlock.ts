import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";

export function boardUnlock(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    let boardId = ensureString(data.get("id"))
    if(boardId == null) {
        log.warning("Invalid board unlock request: {}", [evtId]);

        return false
    }

    log.info("Unlocking board: {}", [boardId]);
    
    let board = Board.load(boardId)
    if (board == null) {
        log.warning("Board {} not found", [boardId]);

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