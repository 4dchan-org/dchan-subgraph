import { Message } from "../../generated/Relay/Relay";
import { Board, BoardCreationEvent, Post, PostCreationEvent, Thread, ThreadCreationEvent } from "../../generated/schema";
import { eventId } from "../id";

export function creationEventId(message: Message): string {
    return eventId(message)
}

export function createBoardCreationEvent(message: Message, board: Board): BoardCreationEvent {
    let event = new BoardCreationEvent(creationEventId(message))
    event.board = board.id
    event.save()

    return event
}

export function createThreadCreationEvent(message: Message, thread: Thread): ThreadCreationEvent {
    let event = new ThreadCreationEvent(creationEventId(message))
    event.thread = thread.id
    event.save()

    return event
}

export function createPostCreationEvent(message: Message, post: Post): PostCreationEvent {
    let event = new PostCreationEvent(creationEventId(message))
    event.post = post.id
    event.save()

    return event
}