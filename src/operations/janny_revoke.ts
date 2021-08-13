import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, BoardJanny, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";
import { boardJannyId } from "../internal/board_janny";

export function jannyrevoke(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    log.info("Janny revoke attempt by {}: {}", [user.id, evtId]);

    let boardId = ensureString(data.get("board_id"))
    let userId = ensureString(data.get("user_id"))
    if(userId === null || boardId === null) {
        log.info("Invalid janny revoke request: {}", [evtId])

        return false
    }

    if(!isBoardJanny(user.id, boardId)) {
        return false
    }
    
    let board = Board.load(boardId)
    if(board.createdBy === userId) {
        log.info("Cannot revoke janny status of board creator: {}", [evtId])

        return false
    }

    store.remove("BoardJanny", boardJannyId(userId, boardId))

    log.info("Board {} janny {} revoked by {}: {}", [boardId, userId, user.id, evtId]);

    return true
}