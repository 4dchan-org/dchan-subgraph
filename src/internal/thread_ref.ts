import { Message } from "../../generated/Relay/Relay";
import { Thread, ThreadRef } from "../../generated/schema";
import { eventId } from "../id";
import { shortThreadId } from "./thread";

export function createThreadRefs(message: Message, thread: Thread) : void {
    let ref: ThreadRef | null = null

    ref = new ThreadRef(eventId(message))
    ref.thread = thread.id
    ref.save()

    ref = new ThreadRef(shortThreadId(message))
    ref.thread = thread.id
    ref.save()
}