import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Post, Thread } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isJanny } from "../jannies";

export function threadRemove(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHexString()

    let threadId = ensureString(data.get("id"))

    log.debug("Requested thread removal: {}", [threadId]);
    
    let thread = Thread.load(threadId)
    if (thread != null) {
        let op = Post.load(thread.op)

        if(op != null) {
            store.remove('Post', op.id)

            if((op.from == txFrom) || isJanny(txFrom)) {
                log.debug("Removing thread: {}", [threadId])

                store.remove('Thread', threadId)

                log.info("Thread removed: {}", [threadId])

                return true
            } else {
                log.warning("Thread not owned by {}, skipping", [txFrom])
            }
        } else {
            log.error("Thread op not found, wtf?", [])
        }
    } else {
        log.warning("Thread not found, skipping", [])
    }

    return false
}