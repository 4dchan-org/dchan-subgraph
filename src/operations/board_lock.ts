import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isJanny } from "../jannies";
import { eventId } from "../utils";

export function boardLock(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHexString()

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

    if((board.createdBy != txFrom) && !isJanny(txFrom)) {
        log.warning("Board {} not owned by {}, skipping {}", [boardId, txFrom, evtId])

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