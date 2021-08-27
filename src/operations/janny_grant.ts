import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { BoardJanny, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";
import { boardJannyId } from "../internal/board_janny";
import { createBlockFromMessage } from "../internal/block";

export function jannyGrant(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)
    let block = createBlockFromMessage(message)

    log.info("Janny grant attempt by {}: {}", [user.id, evtId]);

    let boardId = ensureString(data.get("board"))
    let userId = ensureString(data.get("user"))
    if(userId === null || boardId === null) {
        log.info("Invalid janny grant request: {}", [evtId])

        return false
    }

    if(!isBoardJanny(user.id, boardId)) {
        return false
    }

    let janny = new BoardJanny(boardJannyId(userId, boardId))
    janny.user = userId
    janny.board = boardId
    janny.grantedAtBlock = block.id
    janny.grantedAt = block.timestamp
    janny.save()

    log.info("Janny granted to {}: {}", [user.id, evtId]);

    return true
}