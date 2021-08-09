import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Post, Thread } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isJanny } from "../jannies";
import { eventId } from "../utils";

export function threadRemove(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHexString()

    let threadId = ensureString(data.get("id"))
    let evtId = eventId(message)
    if(threadId == null) {
        log.warning("Invalid thread remove request: {}", [evtId]);

        return false
    }

    log.debug("Requested thread removal: {}", [threadId]);
    
    let thread = Thread.load(threadId)
    if (thread == null) {
        log.warning("Thread not found, skipping", [])
        
        return false
    }

    let op = Post.load(thread.op)
    if(op != null) {
        store.remove('Post', op.id)

        if((op.from != txFrom) && !isJanny(txFrom)) {
            log.warning("Thread not owned by {}, skipping", [txFrom])

            return false
        }
    } else {
        log.error("Thread op for {} not found, wtf?", [threadId])

        return false
    }

    log.debug("Removing thread: {}", [threadId])

    store.remove('Thread', threadId)

    log.info("Thread removed: {}", [threadId])

    return true
}