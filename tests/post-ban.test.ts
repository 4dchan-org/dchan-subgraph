import {
    assert,
    describe,
    test,
    beforeEach,
    clearStore
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { handleMessage } from "../src/relay"
import { createMessageEvent } from "./relay-utils"
import { createPost, createThread, createBoard, claimAdmin } from "./helpers"
import { Ban, Board, BoardBan, Post, PostBan, User } from "../generated/schema"
import { banId } from "../src/internal/ban"
import { boardBanId } from "../src/internal/board_ban"
import { postBanId } from "../src/internal/post_ban"
import { locateUserFromId } from "../src/internal/user"

describe("Post ban", () => {
    beforeEach(() => {
        clearStore()
    })

    test("ban user (by janny)", () => {
        let boardId = createBoard("d", "dchan")
        let threadId = createThread(boardId, "ayy")
        let post = Post.load(createPost(threadId, "lmao"))!

        let from = Address.fromString("0x0000000000000000000000000000000000000000")
        let jsonMessage = `{"ns": "dchan","v": 0,"op": "post:ban","data": {"id": "${post.id}", "reason": "bad post", "seconds": 1000}}`
        let newMessageEvent = createMessageEvent(from, jsonMessage)
        
        const admin = User.load(from.toHexString())!
        
        assert.notInStore("Ban", banId(newMessageEvent))
        assert.notInStore("BoardBan", boardBanId(admin, Board.load(boardId)!))
        assert.notInStore("PostBan", postBanId(post, Board.load(boardId)!))

        handleMessage(newMessageEvent)

        let ban = Ban.load(banId(newMessageEvent)) as Ban
        let boardBan = BoardBan.load(boardBanId(admin, Board.load(boardId)!)) as BoardBan
        let postBan = PostBan.load(postBanId(post, Board.load(boardId)!)) as PostBan

        assert.fieldEquals("Ban", ban.id, "expiresAt", "1001")
        assert.fieldEquals("Ban", ban.id, "reason", "bad post")
        assert.fieldEquals("Ban", ban.id, "from", admin.id)
        assert.fieldEquals("BoardBan", boardBan.id, "user", post.from)
        assert.fieldEquals("BoardBan", boardBan.id, "board", boardId)
        assert.fieldEquals("BoardBan", boardBan.id, "ban", ban.id)
        assert.fieldEquals("PostBan", postBan.id, "user", post.from)
        assert.fieldEquals("PostBan", postBan.id, "post", post.id)
        assert.fieldEquals("PostBan", postBan.id, "ban", ban.id)
    })

    test("ban user (by user)", () => {
        let boardId = createBoard("d", "dchan")
        let threadId = createThread(boardId, "ayy")
        let post = Post.load(createPost(threadId, "lmao"))!

        let from = Address.fromString("0x0000000000000000000000000000000000000001")
        let jsonMessage = `{"ns": "dchan","v": 0,"op": "post:ban","data": {"id": "${post.id}", "reason": "bad post", "seconds": 1000}}`
        let newMessageEvent = createMessageEvent(from, jsonMessage)
        
        const admin = locateUserFromId(from.toHexString())!
        
        assert.notInStore("Ban", banId(newMessageEvent))
        assert.notInStore("BoardBan", boardBanId(admin, Board.load(boardId)!))
        assert.notInStore("PostBan", postBanId(post, Board.load(boardId)!))

        handleMessage(newMessageEvent)
        
        assert.notInStore("Ban", banId(newMessageEvent))
        assert.notInStore("BoardBan", boardBanId(admin, Board.load(boardId)!))
        assert.notInStore("PostBan", postBanId(post, Board.load(boardId)!))
    })
})