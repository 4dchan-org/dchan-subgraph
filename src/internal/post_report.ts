import { Message } from "../../generated/Relay/Relay";
import { Post, PostReport, User } from "../../generated/schema";
import { createReport } from './report'

export type PostReportId = string

export function postReportId(from: User, post: Post): PostReportId {
    return from.id + ":" + post.id
}

export function createPostReport(message: Message, user: User, post: Post, reason: string): PostReport {
    let report = createReport(message, reason)
    let id = postReportId(user, post as Post)
    
    let postReport = new PostReport(id)
    postReport.post = post.id
    postReport.report = report.id
    postReport.save()

    return postReport
}