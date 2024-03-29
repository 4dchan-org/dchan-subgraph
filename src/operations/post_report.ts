import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { Post, Thread, User } from "../../generated/schema"
import { ensureString } from "../ensure"
import { scorePenalty } from "../score"
import { eventId } from "../id"
import { createPostReport, postReportId } from "../internal/post_report"
import { loadPostFromId } from "../internal/post"
import { loadThreadFromId } from "../internal/thread"

export function postReport(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    let maybePostId = ensureString(data.get("id"))
    let reason = ensureString(data.get("reason"))
    if(maybePostId == null) {
        log.warning("Invalid post report request: {}", [evtId])

        return false
    }

    let postId = maybePostId as string
    log.debug("Reported post: {}", [postId])
    
    let post = loadPostFromId(postId)
    if (post == null) {
        log.warning("Post {} not found, skipping {}", [postId, evtId])

        return false
    }
    post.score = scorePenalty(post.score)
    post.save()

    let thread = loadThreadFromId(post.id)
    if (thread != null) {
        thread.score = post.score

        thread.save()
    }

    createPostReport(message, user, post as Post, reason ? reason as string : "")

    return true
}