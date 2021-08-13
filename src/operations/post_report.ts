import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Post, PostReport, Thread, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { scorePenalize } from "../score";
import { eventId } from "../id";

export function postReport(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    let postId = ensureString(data.get("id"))
    let reason = ensureString(data.get("reason"))
    if(postId == null || reason == null) {
        log.warning("Invalid post report request: {}", [evtId]);

        return false
    }

    log.debug("Reported post: {}", [postId]);
    
    let post = Post.load(postId)
    if (post == null) {
        log.warning("Post {} not found, skipping {}", [postId, evtId])

        return false
    }
    post.score = scorePenalize(post.score)
    post.save()

    let thread = Thread.load(postId)
    if (thread != null) {
        thread.score = post.score

        thread.save()
    }

    let postReport = new PostReport(evtId)
    postReport.reason = reason
    postReport.post = postId
    postReport.from = user.id
    postReport.save()

    return true
}