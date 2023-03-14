import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, Image, Post, Thread, User } from "../../generated/schema";
import { ensureBoolean, ensureObject, ensureString } from "../ensure";
import { eventId, shortUniqueId } from "../id";
import { POST_COMMENT_MAX_LENGTH, POST_FILENAME_MAX_LENGTH, POST_NAME_MAX_LENGTH, POST_SUBJECT_MAX_LENGTH } from "../constants";
import { scoreDefault } from "../score";
import { userIsBoardBanned } from "../internal/board_ban";
import { createPostRefs } from "../internal/post_ref";
import { createThreadRefs } from "../internal/thread_ref";
import { locateBlockFromMessage } from "../internal/block";
import { loadThreadFromId } from "../internal/thread";
import { loadBoardFromId } from "../internal/board";
import { isBoardJanny } from "../internal/board_janny";
import { postId } from "../internal/post";

export function postCreate(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)
    let block = locateBlockFromMessage(message)

    let threadId = ensureString(data.get("thread"))
    let boardId = ensureString(data.get("board"))
    let sage = "true" == ensureBoolean(data.get("sage"))

    // Throttling
    // if(user.lastPostedAt && message.block.timestamp < user.lastPostedAt.plus(BigInt.fromI32(50))) {
    //     log.info("Throttling user {}: {}", [user.id, evtId]);

    //     return  false
    // }

    let thread: Thread | null = null
    if (threadId) {
        log.info("Replying to {}", [threadId]);

        thread = loadThreadFromId(threadId)
        if (thread) {
            boardId = thread.board
        } else {
            log.warning("Invalid thread {}, skipping {}", [threadId, evtId])

            return false
        }
    } else if (boardId) {
        log.info("Creating new thread on {}", [boardId]);
    } else {
        log.warning("Invalid post create request", [])

        return false
    }

    let maybeBoard = boardId ? loadBoardFromId(boardId) : null
    if (!maybeBoard && boardId) {
        log.warning("Invalid board {}, skipping {}", [boardId, evtId])

        return false
    }

    let board = maybeBoard as Board;
    if (userIsBoardBanned(message, user, board)) {
        log.warning("User is banned from this board, skipping {}", [evtId])

        return false
    }

    if (thread && thread.isLocked && board && !isBoardJanny(user, board.id) && threadId) {
        log.warning("Thread {} locked, skipping {}", [threadId, evtId])

        return false
    }

    if (board && board.isLocked && !isBoardJanny(user, board.id)) {
        log.warning("Board {} locked, skipping {}", [board.id, evtId])

        return false
    }

    let comment = ensureString(data.get("comment"))
    if (comment && comment.length > POST_COMMENT_MAX_LENGTH) {
        log.warning("Comment over length limit, skipping {}", [evtId])

        return false
    }

    log.info("Creating image: {}", [evtId]);
    let image: Image | null = null
    let file = ensureObject(data.get("file"))
    if (file) {
        let name = ensureString(file.get('name'))
        let ipfs = ensureObject(file.get('ipfs'))
        let ipfsHash: string | null = ipfs ? ensureString(ipfs.get('hash')) : null

        if (name && ipfsHash) {
            if (name.length > POST_FILENAME_MAX_LENGTH) {
                log.warning("Filename over length limit, skipping {}", [evtId])

                return false
            }

            let isNsfw = "true" == ensureBoolean(file.get('is_nsfw'))
            let isSpoiler = "true" == ensureBoolean(file.get('is_spoiler'))

            image = new Image(shortUniqueId(evtId))
            image.score = scoreDefault()
            image.name = name
            image.ipfsHash = ipfsHash as string
            image.isNsfw = isNsfw || false
            image.isSpoiler = isSpoiler || false
        } else {
            log.warning("Invalid image", [])

            return false
        }
    }

    log.info("Creating post: {}", [evtId]);
    let name = ensureString(data.get("name"))
    if (name && name.length > POST_NAME_MAX_LENGTH) {
        log.warning("Name over length limit, skipping {}", [evtId])

        return false
    }

    let pId = postId(message)
    let post = new Post(pId)
    post.score = scoreDefault()
    post.n = block.timestamp
    post.comment = comment ? comment as string : ""
    post.createdAtBlock = block.id
    post.createdAt = block.timestamp
    post.name = (!!name && name !== "") ? name : "Anonymous"
    post.from = user.id
    post.sage = sage
    if (image) {
        post.image = image.id
    }

    if (post.comment === "" && post.image) {
        log.warning("Invalid post, skipping {}", [evtId])

        return false
    }

    if (thread && thread.archivedAt !== null && (thread.archivedAt as BigInt).lt(block.timestamp)) {
        log.warning("Cannot reply to archived thread {}", [evtId])

        return false
    }

    createPostRefs(message, post)

    if (thread) {
        log.debug("Replying to thread {}", [thread.id]);
        post.thread = thread.id

        thread.replyCount = thread.replyCount.plus(BigInt.fromI32(1))
        thread.imageCount = thread.imageCount.plus(BigInt.fromI32(image ? 1 : 0))
    } else if (board) {
        log.debug("Creating thread {}", [evtId]);

        let subject = ensureString(data.get("subject"))
        if (subject && subject.length > POST_SUBJECT_MAX_LENGTH) {
            log.warning("Subject over length limit, skipping {}", [evtId])

            return false
        }

        board.threadCount = board.threadCount.plus(BigInt.fromI32(1))
        
        thread = new Thread(pId)
        thread.score = scoreDefault()
        thread.board = board.id
        thread.subject = subject
        thread.isPinned = false
        thread.isLocked = false
        thread.op = pId
        thread.n = block.timestamp
        thread.from = user.id
        thread.replyCount = BigInt.fromI32(0)
        thread.imageCount = BigInt.fromI32(0)
        thread.createdAtBlock = block.id
        thread.createdAt = block.timestamp
        thread.lastBumpedAtBlock = block.id
        thread.lastBumpedAt = block.timestamp

        createThreadRefs(message, thread as Thread)
    }

    thread = thread as Thread

    post.board = board.id
    user.lastPostedAtBlock = block.id
    board.postCount = board.postCount.plus(BigInt.fromI32(1))

    // If saging do not bump
    if(sage == false) {
        board.lastBumpedAtBlock = block.id
        board.lastBumpedAt = block.timestamp
        thread.lastBumpedAtBlock = block.id
        thread.lastBumpedAt = block.timestamp

        if(board.threadLifetime !== null) {
            thread.archivedAt = block.timestamp.plus(board.threadLifetime as BigInt)
        }
    }

    // Update ppm
    // Is this correct?
    thread.ppm = BigInt.fromI32(1_000_000_000).times(thread.replyCount).div(BigInt.fromI32(1).plus(block.timestamp).minus(thread.createdAt))
    // This is basically le reddit's epic upboat algorithm but probably wrong
    thread.popularity = BigInt.fromI32(86_400).times(thread.ppm).plus(thread.createdAt)
    // @TODO Fix this

    log.info("Saving: {}", [evtId]);

    if (image) {
        image.save()
    }
    thread.save()
    user.save()
    post.save()
    board.save()

    log.info("Post created: {}", [evtId]);

    return true
}