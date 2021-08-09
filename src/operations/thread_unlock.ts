import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Post, Thread } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isJanny } from "../jannies";
import { eventId } from "../utils";

export function threadUnlock(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHexString()

    let threadId = ensureString(data.get("id"))
    let evtId = eventId(message)
    if(threadId == null) {
        log.warning("Invalid thread lock request: {}", [evtId]);

        return false
    }

    log.info("Unlocking thread: {}", [threadId]);
    
    let thread = Thread.load(threadId)
    if (thread == null) {
        log.warning("Thread not found: {}", [threadId]);

        return false
    }

    let op = Post.load(thread.op)
    if(op == null) {
        log.error("Thread op for {} not found, wtf?", [threadId])

        return false
    }

    if((op.from != txFrom) && !isJanny(txFrom)) {
        log.warning("Thread {} not owned by {}, skipping {}", [threadId, txFrom, evtId])

        return false
    }
    
    if(!thread.isLocked) {
        log.warning("Thread {} not locked, skipping {}", [threadId, evtId])

        return false
    }

    thread.isLocked = false
    thread.save()

    log.info("Thread unlocked: {}", [threadId])
    
    return true
}