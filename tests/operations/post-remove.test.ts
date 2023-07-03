import {
    assert,
    describe,
    test,
    beforeEach,
    clearStore
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { handleMessage } from "../../src/relay"
import { createMessageEvent } from "../relay-utils"
import { createPost, createThread, createBoard, jannyGrant, claimAdmin } from "../helpers"
import { Post } from "../../generated/schema"

describe("Post remove", () => {
    beforeEach(() => {
        clearStore()
    })

    test("remove post by owner", () => {
        let boardId = createBoard("d", "4dchan.org")
        let threadId = createThread(boardId, "ayy")
        let postId = createPost(threadId, "lmao")

        let from = Address.fromString("0x0000000000000000000000000000000000000000")
        let jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "post:remove","data": {"ids": ["${postId}"]}}`
        let newMessageEvent = createMessageEvent(from, jsonMessage)
        
        assert.fieldEquals("Post", postId, "id", postId)
        assert.fieldEquals("Thread", threadId, "id", threadId)
        assert.fieldEquals("Thread", threadId, "replyCount", "1")
        assert.fieldEquals("Board", boardId, "postCount", "2")

        handleMessage(newMessageEvent)

        assert.notInStore("Post", postId)
        // assert.fieldEquals("Thread", threadId, "replyCount", "0")
        // assert.fieldEquals("Board", boardId, "postCount", "1")
    })

    // test("remove post by janny", () => {
        
    //     let boardId = createBoard("d", "4dchan.org")
    //     let threadId = createThread(boardId, "ayy")
    //     let postId = createPost(threadId, "lmao")
        
    //     claimAdmin()

    //     jannyGrant(boardId, Address.fromString("0x0000000000000000000000000000000000000001"))

    //     let from = Address.fromString("0x0000000000000000000000000000000000000001")
    //     let jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "post:remove","data": {"ids": ["${postId}"]}}`
    //     let newMessageEvent = createMessageEvent(from, jsonMessage)
        
    //     assert.fieldEquals("Post", postId, "id", postId)
    //     assert.fieldEquals("Thread", threadId, "id", threadId)
    //     assert.fieldEquals("Thread", threadId, "replyCount", "1")
    //     assert.fieldEquals("Board", boardId, "postCount", "2")

    //     handleMessage(newMessageEvent)

    //     assert.notInStore("Post", postId)
    //     assert.fieldEquals("Thread", threadId, "replyCount", "0")
    //     assert.fieldEquals("Board", boardId, "postCount", "1")
    // })

    // test("remove post by user", () => {
    //     let boardId = createBoard("d", "4dchan.org")
    //     let threadId = createThread(boardId, "ayy")
    //     let postId = createPost(threadId, "lmao")

    //     let from = Address.fromString("0x0000000000000000000000000000000000000001")
    //     let jsonMessage = `{"ns": "4dchan.org","v": 0,"op": "post:remove","data": {"ids": ["${postId}"]}}`
    //     let newMessageEvent = createMessageEvent(from, jsonMessage)
        
    //     assert.fieldEquals("Post", postId, "id", postId)

    //     handleMessage(newMessageEvent)
        
    //     assert.fieldEquals("Post", postId, "id", postId)
    // })
})