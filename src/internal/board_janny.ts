import { BoardJanny } from "../../generated/schema"
import { BoardId } from "./board"
import { isAdmin } from "./admin"
import { UserId } from "./user"

export type BoardJannyId = string

export function boardJannyId(userId: UserId, boardId: BoardId): BoardJannyId {
    return userId + ":" + boardId
}

export function isBoardJanny(userId: UserId, boardId: BoardId): boolean {
    let boardJanny = BoardJanny.load(boardJannyId(userId, boardId))
    return boardJanny !== null || isAdmin(userId)
}