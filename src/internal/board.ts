import { Message } from "../../generated/Relay/Relay";
import { Board, BoardRef, Post, Thread } from "../../generated/schema";
import { eventId, shortUniqueId, txId } from "../id";
import { loadThreadFromId } from "./thread";

export type BoardId = string

export function boardId(message: Message) : BoardId {
    return txId(message)
}

export function shortBoardId(message: Message) : BoardId {
    return shortUniqueId(eventId(message))
}

export function loadBoardFromId(id: BoardId) : Board | null {
    let board : Board | null = null;
    
    let boardRef = BoardRef.load(id)
    if(boardRef != null) {
        board = Board.load(boardRef.board)
    } else {
        board = Board.load(id)
    }

    return board
}

export function loadBoardFromPost(post: Post) : Board | null {
    let threadId = post.thread
    let thread = loadThreadFromId(threadId)
    if(thread == null) {
        return null
    }

    return Board.load(thread.board)
}