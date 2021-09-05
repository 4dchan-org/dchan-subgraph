import { BoardJanny } from "../../generated/schema";
import { BoardId } from "./board";
import { UserId } from "./user";
import { isAdmin } from "./admin"

export type BoardJannyId = string

export function boardJannyId(userId: UserId, boardId: BoardId): BoardJannyId {
    return userId + ":" + boardId
}

export function isBoardJanny(userId: UserId, boardId: BoardId): boolean {
    let boardJanny = BoardJanny.load(boardJannyId(userId, boardId))
    return boardJanny !== null || isAdmin(userId)
}