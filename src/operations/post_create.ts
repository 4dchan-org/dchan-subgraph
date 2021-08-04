import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, Image, Post, Thread, User } from "../../generated/schema";
import { ensureNumber, ensureObject, ensureString } from "../ensure";
import { getThreadId } from "../entities/thread";

export function postCreate(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txId = message.transaction.hash.toHexString()
    let txFrom = message.transaction.from.toHexString()

    let boardId = ensureString(data.get("board"))
    let body = ensureString(data.get("body"))

    log.debug("Loading board {}", [boardId]);
    let board = Board.load(boardId)
    if (board != null) {
        let newPostCount = board.postCount.plus(BigInt.fromI32(1))
        log.debug("Board {} new post count: {}", [boardId, newPostCount.toString()])
        board.postCount = newPostCount

        log.info("Loading user: {}", [txFrom]);
        let user = User.load(txFrom);
        if (user == null) {
            log.info("Creating user: {}", [txId]);

            user = new User(txFrom)
            user.name = "Anonymous"
            user.score = BigInt.fromI32(0)
        }

        log.info("Creating image: {}", [txId]);
        let image: Image | null = null
        let file = ensureObject(data.get("file"))
        if (file != null) {
            let name = ensureString(file.get('name'))
            let byteSize = ensureNumber(file.get('byte_size'))
            let ipfs = ensureObject(file.get('ipfs'))
            let ipfsHash: string | null = ipfs != null ? ensureString(ipfs.get('hash')) : null

            if (name != null && byteSize != null && ipfsHash != null) {
                image = new Image(txId)
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
        let postId = getThreadId(boardId, newPostCount.toString())
        let post = new Post(postId)
        post.score = BigInt.fromI32(0)
        post.n = newPostCount
        post.body = body || ""
        post.createdAtUnix = message.block.timestamp
        post.from = txFrom
        if (image != null) {
            post.image = txId
        }

        let thread: Thread | null = null
        let t = ensureNumber(data.get("thread"))
        if (t != null) {
            let threadId = getThreadId(boardId, t.toString())

            log.info("Replying to {}", [threadId]);

            thread = Thread.load(threadId)
            if(thread != null) {
                post.thread = threadId
                thread.replyCount = thread.replyCount.plus(BigInt.fromI32(1))
                thread.imageCount = thread.imageCount.plus(BigInt.fromI32(image != null ? 1 : 0))
            } else {
                log.warning("Invalid thread reply: {}", [threadId])

                return false
            }
        } else {
            let threadId = getThreadId(board.name, post.n.toString())

            log.info("Creating thread {}", [threadId]);

            thread = new Thread(threadId)
            thread.score = BigInt.fromI32(0)
            thread.board = boardId
            thread.subject = ensureString(data.get("subject"))
            thread.isSticky = false
            thread.isLocked = false
            thread.op = postId
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

        log.info("Saved: {}", [txId]);

        return true
    } else {
        log.warning("Invalid board, skipping", [])

        return false
    }
}