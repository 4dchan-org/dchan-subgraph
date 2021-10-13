import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { User } from "../../generated/schema";
import { ensureBoolean, ensureNumber, ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";
import { loadBoardFromId } from "../internal/board";

export function boardUpdate(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    log.info("Updating board: {}", [evtId]);

    let boardId = ensureString(data.get("id"))
    if (boardId == null) {
        log.warning("Invalid board", [])

        return false
    }
    
    let board = loadBoardFromId(boardId)
    if (board == null) {
        log.warning("Board {} not found", [boardId]);

        return false
    }

    if((board.createdBy != user.id) && !isBoardJanny(user, boardId)) {
        log.warning("User {} is not janny of {}, skipping {}", [user.id, boardId, evtId])

        return false
    }
    
    let title = ensureString(data.get("title"))
    if(title != null) {
        board.title = title
    }
    let isNsfw = "true" == ensureBoolean(data.get("nsfw"))
    if(isNsfw == true) {
        board.isNsfw = isNsfw
    }
    let threadLifetime = ensureNumber(data.get("thread_lifetime"))
    if(threadLifetime != null) {
        board.threadLifetime = threadLifetime
    }
    board.save()

    log.info("Board updated: {}", [evtId]);

    return true
}