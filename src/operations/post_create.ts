import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, Image, Post, Thread, User } from "../../generated/schema";
import { ensureBoolean, ensureNumber, ensureObject, ensureString } from "../ensure";
import { eventId, shortenId } from "../id";
import { POST_COMMENT_MAX_LENGTH, POST_FILENAME_MAX_LENGTH, POST_NAME_MAX_LENGTH, POST_SUBJECT_MAX_LENGTH } from "../constants";
import { scoreDefault } from "../score";
import { userIsBoardBanned } from "../internal/board_ban";

export function postCreate(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    let board: Board | null = null
    let boardId = ensureString(data.get("board"))

    let thread: Thread | null = null
    let threadId = ensureString(data.get("thread"))

    // Throttling
    // if(user.lastPostedAt != null && message.block.timestamp < user.lastPostedAt.plus(BigInt.fromI32(50))) {
    //     log.info("Throttling user {}: {}", [user.id, evtId]);

    //     return  false
    // }

    if (threadId != null) {
        log.info("Replying to {}", [threadId]);

        thread = Thread.load(threadId)
        if (thread == null) {
            log.warning("Invalid thread {}, skipping {}", [threadId, evtId])
    
            return false
        }
        
        board = Board.load(thread.board)
    } else {
        if(boardId == null) {
            log.warning("Invalid post create request", [])

            return false
        }
        
        log.info("Creating new thread on {}", [boardId]);

        board = Board.load(boardId)
    }

    if (board == null) {
        log.warning("Invalid board {}, skipping {}", [boardId, evtId])

        return false
    }

    if (userIsBoardBanned(message, user.id, boardId)) {
        log.warning("User is banned from this board, skipping {}", [evtId])

        return false
    }
    
    let comment = ensureString(data.get("comment"))
    if(comment.length > POST_COMMENT_MAX_LENGTH) {
        log.warning("Comment over length limit, skipping {}", [evtId])

        return false
    }

    let newPostCount = board.postCount.plus(BigInt.fromI32(1))
    board.postCount = newPostCount
    board.lastBumpedAt = message.block.timestamp

    log.info("Creating image: {}", [evtId]);
    let image: Image | null = null
    let file = ensureObject(data.get("file"))
    if (file != null) {
        let name = ensureString(file.get('name'))
        let byteSize = ensureNumber(file.get('byte_size'))
        let ipfs = ensureObject(file.get('ipfs'))
        let ipfsHash: string | null = ipfs != null ? ensureString(ipfs.get('hash')) : null

        if (name != null && byteSize != null && ipfsHash != null) {
            if(name.length > POST_FILENAME_MAX_LENGTH) {
                log.warning("Filename over length limit, skipping {}", [evtId])
        
                return false
            }

            let isNsfw = "true" == ensureBoolean(file.get('is_nsfw'))
            let isSpoiler = "true" == ensureBoolean(file.get('is_spoiler'))
            
            image = new Image(shortenId(evtId))
            image.score = scoreDefault()
            image.name = name
            image.byteSize = byteSize as BigInt
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
    if(name.length > POST_NAME_MAX_LENGTH) {
        log.warning("Name over length limit, skipping {}", [evtId])

        return false
    }

    let post = new Post(evtId)
    post.score = scoreDefault()
    post.n = newPostCount
    post.comment = comment || ""
    post.createdAt = message.block.timestamp
    post.createdAtBlock = message.block.number
    post.name = (!!name && name != "") ? name : "Anonymous"
    post.from = user.id
    if (image != null) {
        post.image = image.id
    }

    if (thread != null) {
        post.thread = threadId

        thread.replyCount = thread.replyCount.plus(BigInt.fromI32(1))
        thread.imageCount = thread.imageCount.plus(BigInt.fromI32(image != null ? 1 : 0))
    } else {
        log.info("Creating thread {}", [evtId]);
        
        let subject = ensureString(data.get("subject"))
        if(subject.length > POST_SUBJECT_MAX_LENGTH) {
            log.warning("Subject over length limit, skipping {}", [evtId])
    
            return false
        }

        board.threadCount = board.threadCount.plus(BigInt.fromI32(1))

        thread = new Thread(evtId)
        thread.score = scoreDefault()
        thread.board = board.id
        thread.subject = subject
        thread.isPinned = false
        thread.isLocked = false
        thread.op = evtId
        thread.replyCount = BigInt.fromI32(0)
        thread.imageCount = BigInt.fromI32(0)
        thread.createdAt = message.block.timestamp
        thread.createdAtBlock = message.block.number
    }

    if (thread.isLocked) {
        log.warning("Thread {} locked, skipping {}", [threadId, evtId])

        return false
    }

    if (board.isLocked) {
        log.warning("Board {} locked, skipping {}", [board.id, evtId])

        return false
    }

    post.board = thread.board

    thread.lastBumpedAt = message.block.timestamp
    user.lastPostedAt = message.block.timestamp

    log.info("Saving: {}", [evtId]);
    
    if (image != null) {
        image.save()
    }
    thread.save()
    user.save()
    post.save()
    board.save()

    log.info("Post created: {}", [evtId]);

    return true
}