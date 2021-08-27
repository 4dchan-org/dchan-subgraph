import { Board, Post } from "../../generated/schema";

export type PostBanId = string

export function postBanId(post: Post, board: Board): PostBanId {
    return post.id + ":" + board.id
}