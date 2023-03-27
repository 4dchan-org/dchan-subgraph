import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { User } from "../../generated/schema"
import { ensureString } from "../ensure"
import { isBoardJanny } from "../internal/board_janny"
import { eventId } from "../id"
import { boardJannyId } from "../internal/board_janny"
import { loadBoardFromId } from "../internal/board"
import { locateUserFromId } from "../internal/user"

export function jannyRevoke(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    log.info("Janny revoke attempt by {}: {}", [user.id, evtId])

    let maybeBoardId = ensureString(data.get("board"))
    let maybeTargetUserId = ensureString(data.get("user"))
    if(maybeBoardId == null || maybeTargetUserId == null) {
        log.info("Invalid janny revoke request: {}", [evtId])

        return false
    }

    let boardId = maybeBoardId as string
    let targetUserId = maybeTargetUserId as string

    let targetUser = locateUserFromId(targetUserId)
    if(!targetUser) {
        log.info("Invalid janny revoke request to inexistent user {}: {}", [targetUserId, evtId])

        return false
    }

    if(!isBoardJanny(user.id, boardId)) {
        return false
    }
    
    let board = loadBoardFromId(boardId)
    if(board !== null && board.createdBy === targetUserId) {
        log.info("Cannot revoke janny status of board creator: {}", [evtId])

        return false
    }

    store.remove("BoardJanny", boardJannyId(targetUser.id, boardId))

    log.info("Board {} janny {} revoked by {}: {}", [boardId, targetUserId, user.id, evtId])

    return true
}