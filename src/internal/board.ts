import { Message } from "../../generated/Relay/Relay"
import { Board, BoardRef, Post } from "../../generated/schema"
import { eventId, shortUniqueId, txId } from "../id"
import { loadThreadFromId } from "./thread"

export type BoardId = string

export function boardId(message: Message) : BoardId {
    return txId(message)
}

export function shortBoardId(message: Message) : BoardId {
    return shortUniqueId(eventId(message))
}

export function loadBoardFromId(id: BoardId) : Board | null {
    let boardRef = BoardRef.load(id)
    let boardId: string = boardRef != null && boardRef.board !== null ? boardRef.board as string : id

    return Board.load(boardId)
}

export function loadBoardFromPost(post: Post) : Board | null {
    let threadId = post.thread

    let thread = threadId !== null ? loadThreadFromId(threadId) : null
    if(thread === null || thread.board === null) {
        return null
    }

    return Board.load(thread.board)
}