import { Message } from "../../generated/Relay/Relay"
import { Post, PostReport, User } from "../../generated/schema"
import { PostId } from "./post"
import { createReport } from './report'
import { UserId } from "./user"

export type PostReportId = string

export function postReportId(fromId: UserId, postId: PostId): PostReportId {
    return fromId + ":" + postId
}

export function createPostReport(message: Message, user: User, post: Post, reason: string): PostReport {
    let report = createReport(message, reason)
    let id = postReportId(user.id, post.id)
    
    let postReport = new PostReport(id)
    postReport.post = post.id
    postReport.report = report.id
    postReport.save()

    return postReport
}