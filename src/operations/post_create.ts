import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, Image, Post, Thread } from "../../generated/schema";
import { ensureBoolean, ensureNumber, ensureObject, ensureString } from "../ensure";
import { eventId } from "../utils";
import { userLoadOrCreate } from "./internal/user_load_or_create"

export function postCreate(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHexString()
    let evtId = eventId(message)

    let board: Board | null = null
    let boardId = ensureString(data.get("board"))

    let thread: Thread | null = null
    let threadId = ensureString(data.get("thread"))

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
    
    let comment = ensureString(data.get("comment"))

    let newPostCount = board.postCount.plus(BigInt.fromI32(1))
    log.debug("Board {} new post count: {}", [board.id, newPostCount.toString()])
    board.postCount = newPostCount

    let user = userLoadOrCreate(message)

    log.info("Creating image: {}", [evtId]);
    let image: Image | null = null
    let file = ensureObject(data.get("file"))
    if (file != null) {
        let name = ensureString(file.get('name'))
        let byteSize = ensureNumber(file.get('byte_size'))
        let ipfs = ensureObject(file.get('ipfs'))
        let ipfsHash: string | null = ipfs != null ? ensureString(ipfs.get('hash')) : null

        if (name != null && byteSize != null && ipfsHash != null) {
            let isNsfw = "true" == ensureBoolean(file.get('is_nsfw'))
            let isSpoiler = "true" == ensureBoolean(file.get('is_spoiler'))
            
            image = new Image(evtId)
            image.score = BigInt.fromI32(0)
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
    let post = new Post(evtId)
    post.score = BigInt.fromI32(0)
    post.n = newPostCount
    post.comment = comment || ""
    post.createdAtUnix = message.block.timestamp
    post.name = (!!name && name != "") ? name : "Anonymous"
    post.from = txFrom
    if (image != null) {
        post.image = evtId
    }

    if (thread != null) {
        post.thread = threadId
        thread.replyCount = thread.replyCount.plus(BigInt.fromI32(1))
        thread.imageCount = thread.imageCount.plus(BigInt.fromI32(image != null ? 1 : 0))
    } else {
        log.info("Creating thread {}", [evtId]);

        thread = new Thread(evtId)
        thread.score = BigInt.fromI32(0)
        thread.board = board.id
        thread.subject = ensureString(data.get("subject"))
        thread.isSticky = false
        thread.isLocked = false
        thread.op = evtId
        thread.replyCount = BigInt.fromI32(0)
        thread.imageCount = BigInt.fromI32(0)
    }

    if (thread.isLocked) {
        log.warning("Thread {} locked, skipping {}", [threadId, evtId])

        return false
    }

    if (board.isLocked) {
        log.warning("Board {} locked, skipping {}", [board.id, evtId])

        return false
    }

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