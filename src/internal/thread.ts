import { Message } from "../../generated/Relay/Relay";
import { Thread, ThreadRef } from "../../generated/schema";
import { postId, shortPostId } from "./post";

export type ThreadId = string

export function threadId(message: Message): ThreadId {
    return postId(message)
}

export function shortThreadId(message: Message): ThreadId {
    return shortPostId(message)
}

export function loadThreadFromId(id: ThreadId) : Thread | null {
    let threadRef = ThreadRef.load(id)
    let threadId: string = threadRef != null && threadRef.thread !== null ? threadRef.thread as string : id

    return Thread.load(threadId)
}
