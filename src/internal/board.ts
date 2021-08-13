import { Board, Post, Thread } from "../../generated/schema";

export type BoardId = string

export function loadBoardFromPost(post: Post) : Board | null {
    let threadId = post.thread
    let thread = Thread.load(threadId)
    if(thread == null) {
        return null
    }

    return Board.load(thread.board)
}