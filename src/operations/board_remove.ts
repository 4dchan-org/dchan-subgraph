import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isJanny } from "../jannies";
import { eventId } from "../utils";

export function boardRemove(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHexString()

    let boardId = ensureString(data.get("id"))

    log.debug("Requested board removal: {}", [boardId]);
    
    let board = Board.load(boardId)
    if (board != null) {
        if((board.createdBy == txFrom) || isJanny(txFrom)) {
            log.debug("Removing board: {}", [boardId])

            store.remove('Board', boardId)

            log.info("Board removed: {}", [boardId])

            return true
        } else {
            log.warning("Board not owned by {}, skipping", [txFrom])
        }
    } else {
        log.warning("Board not found, skipping", [])
    }

    return false
}