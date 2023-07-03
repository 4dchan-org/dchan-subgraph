import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { Board, BoardJanny, User } from "../../generated/schema"
import { ensureBoolean, ensureNumber, ensureString } from "../ensure"
import { scoreDefault } from "../score"
import { eventId } from "../id"
import { boardJannyId } from "../internal/board_janny"
import { locateBlockFromMessage } from "../internal/block"
import { BOARD_NAME_MAX_LENGTH, BOARD_TITLE_MAX_LENGTH } from '../constants'
import { boardId } from "../internal/board"
import { createBoardRefs } from "../internal/board_ref"

export function boardCreate(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)
    let block = locateBlockFromMessage(message)

    log.info("Creating board: {}", [evtId])

    // { "name": "4dchan.org", "title": "4dchan.org" }
    let maybeName = ensureString(data.get("name"))
    let maybeTitle = ensureString(data.get("title"))
    let maybeThreadLifetime = ensureNumber(data.get("thread_lifetime"))

    if(!maybeName || !maybeTitle) {
        log.warning("Invalid board create request: {}", [evtId])

        return false
    }

    let name = maybeName as string
    let title = maybeTitle as string

    if (name.length == 0 || name.length > BOARD_NAME_MAX_LENGTH || title.length == 0 || title.length > BOARD_TITLE_MAX_LENGTH) {
        log.warning("Invalid board create request: {}", [evtId])

        return false
    }

    let board = new Board(boardId(message))
    board.name = name as string
    board.title = title as string
    board.threadCount = BigInt.fromI32(0)
    board.postCount = BigInt.fromI32(0)
    board.score = scoreDefault()
    board.createdBy = user.id
    board.createdAtBlock = block.id
    board.createdAt = block.timestamp
    board.lastBumpedAtBlock = block.id
    board.lastBumpedAt = block.timestamp
    board.isNsfw = ("true" === ensureBoolean(data.get("nsfw"))) || false
    board.isLocked = false
    board.threadLifetime = maybeThreadLifetime

    createBoardRefs(message, board)

    let boardJanny = new BoardJanny(boardJannyId(user.id, board.id))
    boardJanny.grantedAtBlock = block.id
    boardJanny.grantedAt = block.timestamp
    boardJanny.board = board.id
    boardJanny.user = user.id
    
    user.save()
    board.save()
    boardJanny.save()

    log.info("Board created: {}", [evtId])

    return true
}