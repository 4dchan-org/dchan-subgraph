import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board } from "../../generated/schema";
import { ensureBoolean, ensureString } from "../ensure";
import { isJanny } from "../jannies";
import { eventId } from "../utils";
import { userLoadOrCreate } from "./internal/user_load_or_create";

export function boardCreate(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHexString()
    let evtId = eventId(message)

    log.info("Creating board: {}", [evtId]);

    let boardId = ensureString(data.get("id"))
    if (boardId == null) {
        log.warning("Invalid board", [])

        return false
    }
    
    let board = Board.load(boardId)
    if (board == null) {
        log.warning("Board {} not found", [boardId]);

        return false
    }

    if((board.createdBy != txFrom) && !isJanny(txFrom)) {
        log.warning("Board {} not owned by {}, skipping {}", [boardId, txFrom, evtId])

        return false
    }
    
    let title = ensureString(data.get("title"))
    if(title != null) {
        board.title = title
    }
    let isNsfw = "true" == ensureBoolean(data.get("nsfw"))
    if(isNsfw != null) {
        board.isNsfw = isNsfw
    }
    board.save()

    log.info("Board updated: {}", [evtId]);

    return true
}