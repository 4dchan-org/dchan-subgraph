import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { User } from "../../generated/schema"
import { ensureString } from "../ensure"
import { isBoardJanny } from "../internal/board_janny"
import { eventId } from "../id"
import { loadThreadFromId } from "../internal/thread"
import { loadPostFromId } from "../internal/post"

export function threadUnlock(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let maybeThreadId = ensureString(data.get("id"))
    let evtId = eventId(message)
    if(!maybeThreadId) {
        log.warning("Invalid thread lock request: {}", [evtId])

        return false
    }

    let threadId = maybeThreadId as string
    log.info("Unlocking thread: {}", [threadId])
    
    let thread = loadThreadFromId(threadId)
    if (!thread) {
        log.warning("Thread not found: {}", [threadId])

        return false
    }

    let op = thread.op ? loadPostFromId(thread.op as string) : null
    if(!op) {
        log.error("Thread op for {} not found, wtf?", [threadId])

        return false
    }

    if((op.from != user.id) && thread.board && !isBoardJanny(user, thread.board as string)) {
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