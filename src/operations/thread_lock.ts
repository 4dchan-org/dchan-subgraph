import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Thread } from "../../generated/schema";
import { ensureNumber, ensureString } from "../ensure";
import { getThreadId } from "../entities/thread";

export function threadLock(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txId = message.transaction.from.toHexString()

    log.info("Locking thread: {}", [txId]);

    let threadId = ensureNumber(data.get("thread"))
    let boardId = ensureString(data.get("board"))

    let t = getThreadId(boardId, threadId.toString())
    
    let thread = Thread.load(t)
    if (thread != null) {
        thread.isLocked = true
        thread.save()

        log.info("Thread {} locked", [t])
        
        return true
    } else {
        log.warning("Thread not found: {}", [txId]);

        return false
    }
}