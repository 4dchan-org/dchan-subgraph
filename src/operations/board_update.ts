import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, User } from "../../generated/schema";
import { ensureBoolean, ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";

export function boardUpdate(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    log.info("Creating board: {}", [evtId]);

    let boardId = ensureString(data.get("id"))
    if (boardId == null) {
        log.warning("Invalid board", [])

        return false
    }
    
    let board = Board.load(boardId)
    if (board == null) {
        log.warning("Board {} not found", [boardId]);

        return false
    }

    if((board.createdBy != user.id) && !isBoardJanny(user.id, boardId)) {
        log.warning("User {} is not janny of {}, skipping {}", [user.id, boardId, evtId])

        return false
    }
    
    let title = ensureString(data.get("title"))
    if(title != null) {
        board.title = title
    }
    let isNsfw = "true" == ensureBoolean(data.get("nsfw"))
    if(isNsfw != null) {
        board.isNsfw = isNsfw
    }
    board.save()

    log.info("Board updated: {}", [evtId]);

    return true
}