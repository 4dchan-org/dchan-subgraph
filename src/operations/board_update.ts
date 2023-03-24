import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { User } from "../../generated/schema"
import { ensureBoolean, ensureNumber, ensureString } from "../ensure"
import { isBoardJanny } from "../internal/board_janny"
import { eventId } from "../id"
import { loadBoardFromId } from "../internal/board"

export function boardUpdate(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    log.info("Updating board: {}", [evtId])

    let maybeBoardId = ensureString(data.get("id"))
    if (!maybeBoardId) {
        log.warning("Invalid board", [])

        return false
    }

    let boardId = maybeBoardId as string
    let board = loadBoardFromId(boardId)
    if (!board) {
        log.warning("Board {} not found", [boardId])

        return false
    }

    if((board.createdBy != user.id) && !isBoardJanny(user, boardId)) {
        log.warning("User {} is not janny of {}, skipping {}", [user.id, boardId, evtId])

        return false
    }
    
    let title = ensureString(data.get("title"))
    if(title != null) {
        board.title = title as string
    }
    let isNsfw = "true" == ensureBoolean(data.get("nsfw"))
    if(isNsfw == true) {
        board.isNsfw = isNsfw as boolean
    }
    board.threadLifetime = ensureNumber(data.get("thread_lifetime"))
    board.save()

    log.info("Board updated: {}", [evtId])

    return true
}