import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, Image, Post, Thread } from "../../generated/schema";
import { ensureNumber, ensureObject, ensureString } from "../ensure";
import { eventId } from "../utils";
import { userLoadOrCreate } from "./internal/user_load_or_create"

export function postCreate(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txId = message.transaction.hash.toHexString()
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
            log.warning("Invalid thread, skipping", [])
    
            return false
        } else {
            board = Board.load(thread.board)
        }
    } else {
        log.info("Creating new thread on {}", [boardId]);

        board = Board.load(boardId)
    }

    if (board == null) {
        log.warning("Invalid board, skipping", [])

        return false
    }

    let comment = ensureString(data.get("comment"))

    let newPostCount = board.postCount.plus(BigInt.fromI32(1))
    log.debug("Board {} new post count: {}", [board.id, newPostCount.toString()])
    board.postCount = newPostCount

    let user = userLoadOrCreate(message)

    log.info("Creating image: {}", [txId]);
    let image: Image | null = null
    let file = ensureObject(data.get("file"))
    if (file != null) {
        let name = ensureString(file.get('name'))
        let byteSize = ensureNumber(file.get('byte_size'))
        let ipfs = ensureObject(file.get('ipfs'))
        let ipfsHash: string | null = ipfs != null ? ensureString(ipfs.get('hash')) : null

        if (name != null && byteSize != null && ipfsHash != null) {
            image = new Image(evtId)
            image.score = BigInt.fromI32(0)
            image.name = name
            image.byteSize = byteSize as BigInt
            image.ipfsHash = ipfsHash as string
        } else {
            log.warning("Invalid image", [])

            return false
        }
    }

    log.info("Creating post: {}", [txId]);
    let name = ensureString(data.get("name"))
    let post = new Post(evtId)
    post.score = BigInt.fromI32(0)
    post.n = newPostCount
    post.comment = comment || ""
    post.createdAtUnix = message.block.timestamp
    post.name = name || "Anonymous"
    post.from = txFrom
    if (image != null) {
        post.image = txId
    }

    if (thread != null) {
        post.thread = threadId
        thread.replyCount = thread.replyCount.plus(BigInt.fromI32(1))
        thread.imageCount = thread.imageCount.plus(BigInt.fromI32(image != null ? 1 : 0))
    } else {
        log.info("Creating thread {}", [txId]);

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

    log.info("Saving: {}", [txId]);
    
    if (image != null) {
        image.save()
    }
    thread.save()
    user.save()
    post.save()
    board.save()

    log.info("Post created: {}", [txId]);

    return true
}