import { JSONValue, log, BigInt, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Ban, Board, BoardBan, Post, PostBan, User } from "../../generated/schema";
import { ensureNumber, ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";
import { banId } from "../internal/ban";
import { boardBanId } from "../internal/board_ban";
import { postBanId } from "../internal/post_ban";
import { loadPostFromId } from "../internal/post";
import { loadUserFromId } from "../internal/user";
import { loadBoardFromId } from "../internal/board";
import { loadThreadFromId } from "../internal/thread";

export function postBan(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)
    
    let maybePostId = ensureString(data.get("id"))
    let maybeReason = ensureString(data.get("reason"))
    let maybeSeconds = ensureNumber(data.get("seconds"))
    if (!maybePostId || !maybeReason || !maybeSeconds) {
        log.warning("Invalid user ban request: {}", [evtId]);

        return false
    }
    let postId = maybePostId as string
    let reason = maybeReason as string
    let seconds = maybeSeconds as BigInt
    log.info("Banning post: {}", [postId]);
    
    let post = loadPostFromId(postId)
    if (!post) {
        log.warning("Post {} not found", [postId]);

        return false
    }

    let postFrom = post.from
    let postUser = loadUserFromId(postFrom)
    if (!postUser) {
        log.warning("User {} not found", [postFrom]);

        return false
    }

    let threadId = post.thread
    let thread = threadId ? loadThreadFromId(threadId) : null;
    if(!thread && threadId) {
        log.warning("Thread {} not found", [threadId]);

        return false
    }

    let boardId = thread ? thread.board : null
    let board = boardId ? loadBoardFromId(boardId) : null
    if(!board && boardId) {
        log.info("Board {} not found", [boardId])

        return false
    }

    if(thread && thread.board && !isBoardJanny(user, thread.board as string)) {
        log.warning("Unauthorized, skipping {}", [evtId])

        return false
    }

    let banExpiresAt: BigInt = message.block.timestamp.plus(seconds as BigInt)

    let ban = new Ban(banId(message))
    ban.expiresAt = banExpiresAt
    ban.reason = reason
    ban.from = user.id
    ban.save()

    let boardBan = new BoardBan(boardBanId(user, board as Board))
    boardBan.user = postFrom
    boardBan.board = boardId
    boardBan.ban = ban.id
    boardBan.save()

    let postBan = new PostBan(postBanId(post as Post, board as Board))
    postBan.user = postFrom
    postBan.post = postId
    postBan.ban = ban.id
    postBan.save()

    log.info("User {} banned until {}", [postFrom, banExpiresAt.toString()])
    
    return true
}