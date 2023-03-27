import { BoardId } from "./board"
import { PostId } from "./post"

export type PostBanId = string

export function postBanId(postId: PostId, boardId: BoardId): PostBanId {
    return postId + ":" + boardId
}