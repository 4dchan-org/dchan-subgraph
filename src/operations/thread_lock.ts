import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Thread } from "../../generated/schema";
import { ensureString } from "../ensure";

export function threadLock(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txId = message.transaction.from.toHexString()

    log.info("Locking thread: {}", [txId]);

    let threadId = ensureString(data.get("thread"))
    
    let thread = Thread.load(threadId)
    if (thread != null) {
        thread.isLocked = true
        thread.save()

        log.info("Thread locked: {}", [threadId])
        
        return true
    } else {
        log.warning("Thread not found: {}", [txId]);

        return false
    }
}