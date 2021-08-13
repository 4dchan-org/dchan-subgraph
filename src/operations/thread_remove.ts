import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Post, Thread, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";

export function threadRemove(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let threadId = ensureString(data.get("id"))
    let evtId = eventId(message)
    if(threadId == null) {
        log.warning("Invalid thread remove request: {}", [evtId]);

        return false
    }

    log.debug("Requested thread removal: {}", [threadId]);
    
    let thread = Thread.load(threadId)
    if (thread == null) {
        log.warning("Thread {} not found, skipping {}", [threadId, evtId])
        
        return false
    }

    let op = Post.load(thread.op)
    if(op != null) {
        store.remove('Post', op.id)

        if((op.from != user.id) && !isBoardJanny(user.id, thread.board)) {
            log.warning("Thread {} not owned by {}, skipping {}", [threadId, user.id, evtId])

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