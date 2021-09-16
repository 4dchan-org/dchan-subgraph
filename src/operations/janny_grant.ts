import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { BoardJanny, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";
import { boardJannyId } from "../internal/board_janny";
import { locateBlockFromMessage } from "../internal/block";

export function jannyGrant(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)
    let block = locateBlockFromMessage(message)

    log.info("Janny grant attempt by {}: {}", [user.id, evtId]);

    let boardId = ensureString(data.get("board"))
    let targetUserId = ensureString(data.get("user"))
    if(targetUserId === null || boardId === null) {
        log.info("Invalid janny grant request: {}", [evtId])

        return false
    }

    let targetUser = User.load(targetUserId)
    if(targetUser === null) {
        log.info("Invalid janny grant request to inexistent user {}: {}", [targetUserId, evtId])

        return false
    }

    if(!isBoardJanny(user, boardId)) {
        return false
    }

    let janny = new BoardJanny(boardJannyId(targetUser as User, boardId))
    janny.user = targetUserId
    janny.board = boardId
    janny.grantedAtBlock = block.id
    janny.grantedAt = block.timestamp
    janny.save()

    log.info("Janny granted to {}: {}", [user.id, evtId]);

    return true
}