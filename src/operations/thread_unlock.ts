import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Post, Thread, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";
import { loadThreadFromId } from "../internal/thread";

export function threadUnlock(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let threadId = ensureString(data.get("id"))
    let evtId = eventId(message)
    if(threadId == null) {
        log.warning("Invalid thread lock request: {}", [evtId]);

        return false
    }

    log.info("Unlocking thread: {}", [threadId]);
    
    let thread = loadThreadFromId(threadId)
    if (thread == null) {
        log.warning("Thread not found: {}", [threadId]);

        return false
    }

    let op = Post.load(thread.op)
    if(op == null) {
        log.error("Thread op for {} not found, wtf?", [threadId])

        return false
    }

    if((op.from != user.id) && !isBoardJanny(user, thread.board)) {
        log.warning("Thread {} not owned by {}, skipping {}", [threadId, user.id, evtId])

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