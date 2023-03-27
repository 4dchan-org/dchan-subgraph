import { log } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { Ban, Board, BoardBan, User } from "../../generated/schema"
import { BoardId } from "./board"
import { UserId } from "./user"

export type BoardBanId = string

export function boardBanId(userId: UserId, boardId: BoardId): BoardBanId {
    return userId + ":" + boardId
}

export function userIsBoardBanned(message: Message, user: User, board: Board): boolean {
    let boardBan = BoardBan.load(boardBanId(user.id, board.id))
    if (boardBan == null) {
        return false
    }
    
    let ban = Ban.load(boardBan.ban)
    if (ban == null) {
        log.error("Ban {} for board ban {} not found?", [])
        return false
    }

    return ban.expiresAt.gt(message.block.timestamp)
}