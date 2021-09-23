import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";
import { boardJannyId } from "../internal/board_janny";
import { loadBoardFromId } from "../internal/board";
import { loadUserFromId } from "../internal/user";

export function jannyRevoke(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    log.info("Janny revoke attempt by {}: {}", [user.id, evtId]);

    let boardId = ensureString(data.get("board"))
    let targetUserId = ensureString(data.get("user"))
    if(targetUserId === null || boardId === null) {
        log.info("Invalid janny revoke request: {}", [evtId])

        return false
    }

    let targetUser = loadUserFromId(targetUserId)
    if(targetUser === null) {
        log.info("Invalid janny revoke request to inexistent user {}: {}", [targetUserId, evtId])

        return false
    }

    if(!isBoardJanny(user, boardId)) {
        return false
    }
    
    let board = loadBoardFromId(boardId)
    if(board.createdBy === targetUserId) {
        log.info("Cannot revoke janny status of board creator: {}", [evtId])

        return false
    }

    store.remove("BoardJanny", boardJannyId(targetUser as User, boardId))

    log.info("Board {} janny {} revoked by {}: {}", [boardId, targetUserId, user.id, evtId]);

    return true
}