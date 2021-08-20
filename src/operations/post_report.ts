import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Post, PostReport, Thread, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { scorePenalty } from "../score";
import { eventId } from "../id";
import { postReportId } from "../internal/post_report";

export function postReport(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    let postId = ensureString(data.get("id"))
    let reason = ensureString(data.get("reason"))
    if(postId == null) {
        log.warning("Invalid post report request: {}", [evtId]);

        return false
    }

    log.debug("Reported post: {}", [postId]);
    
    let post = Post.load(postId)
    if (post == null) {
        log.warning("Post {} not found, skipping {}", [postId, evtId])

        return false
    }
    post.score = scorePenalty(post.score)
    post.save()

    let thread = Thread.load(post.id)
    if (thread != null) {
        thread.score = post.score

        thread.save()
    }

    let reportId = postReportId(user, post as Post)
    let postReport = PostReport.load(reportId)
    if (postReport == null) {
        postReport = new PostReport(reportId)
    }
    postReport.reason = reason
    postReport.post = post.id
    postReport.from = user.id
    postReport.save()

    return true
}