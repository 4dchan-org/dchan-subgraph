import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isJanny } from "../jannies";
import { eventId } from "../utils";

export function boardUnlock(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHexString()

    let boardId = ensureString(data.get("id"))
    let evtId = eventId(message)
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

    if((board.createdBy != txFrom) && !isJanny(txFrom)) {
        log.warning("Board {} not owned by {}, skipping", [boardId, txFrom])

        return false
    }

    if(!board.isLocked) {
        log.warning("Board {} not locked, skipping", [boardId])

        return false
    }
    
    board.isLocked = false
    board.save()

    log.info("Board unlocked: {}", [boardId])
    
    return true
}