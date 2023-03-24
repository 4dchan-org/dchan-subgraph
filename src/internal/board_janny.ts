import { BoardJanny, User } from "../../generated/schema"
import { BoardId } from "./board"
import { isAdmin } from "./admin"

export type BoardJannyId = string

export function boardJannyId(user: User, boardId: BoardId): BoardJannyId {
    return user.id + ":" + boardId
}

export function isBoardJanny(user: User, boardId: BoardId): boolean {
    let boardJanny = BoardJanny.load(boardJannyId(user, boardId))
    return boardJanny !== null || isAdmin(user)
}