import { Message } from "../../generated/Relay/Relay";
import { Thread, ThreadCreationEvent } from "../../generated/schema";
import { eventId, shortUniqueId } from "../id";

export type ThreadId = string

export function threadId(message: Message): ThreadId {
    return shortUniqueId(eventId(message))
}

export function loadThreadFromId(id: ThreadId) : Thread | null {
    let thread : Thread | null = null;
    let threadCreationEvent = ThreadCreationEvent.load(id)
    if(threadCreationEvent != null) {
        thread = Thread.load(threadCreationEvent.thread)
    } else {
        thread = Thread.load(id)
    }

    return thread
}