import { Message } from "../../generated/Relay/Relay";
import { Board, BoardCreationEvent, Post, Thread } from "../../generated/schema";
import { eventId, shortUniqueId } from "../id";

export type BoardId = string

export function boardId(message: Message) : BoardId {
    return shortUniqueId(eventId(message))
}

export function loadBoardFromId(id: BoardId) : Board | null {
    let board: Board | null = null;
    let boardCreationEvent = BoardCreationEvent.load(id)
    if(boardCreationEvent != null) {
        board = Board.load(boardCreationEvent.board)
    } else {
        board = Board.load(id)
    }

    return board
}

export function loadBoardFromPost(post: Post) : Board | null {
    let threadId = post.thread
    let thread = Thread.load(threadId)
    if(thread == null) {
        return null
    }

    return Board.load(thread.board)
}