import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, BoardJanny, User } from "../../generated/schema";
import { ensureBoolean, ensureString } from "../ensure";
import { scoreDefault } from "../score";
import { eventId } from "../id";
import { boardJannyId } from "../internal/board_janny";

export function boardCreate(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    log.info("Creating board: {}", [evtId]);

    // { "name": "dchan", "title": "dchan.network" }
    let name = ensureString(data.get("name"))
    let title = ensureString(data.get("title"))

    if (name == null || title == null || name == "" || title == "") {
        log.warning("Invalid board", [])

        return false
    }

    let createdAt = message.block.timestamp
    let board = new Board(evtId)
    board.name = name
    board.title = title
    board.postCount = BigInt.fromI32(0)
    board.score = scoreDefault()
    board.createdBy = user.id
    board.createdAt = createdAt
    board.lastBumpedAt = createdAt
    board.isNsfw = ("true" === ensureBoolean(data.get("nsfw"))) || false
    board.isLocked = false

    let boardJanny = new BoardJanny(boardJannyId(user.id, board.id))
    boardJanny.createdAt = createdAt
    boardJanny.board = board.id
    boardJanny.user = user.id
    
    user.save()
    board.save()
    boardJanny.save()

    log.info("Board created: {}", [evtId]);

    return true
}