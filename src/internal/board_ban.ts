import { log } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Ban, Board, BoardBan, User } from "../../generated/schema";

export type BoardBanId = string

export function boardBanId(user: User, board: Board): BoardBanId {
    return user.id + ":" + board.id
}

export function userIsBoardBanned(message: Message, user: User, board: Board): boolean {
    let boardBan = BoardBan.load(boardBanId(user, board))
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