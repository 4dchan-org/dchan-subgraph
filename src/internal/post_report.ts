import { Post, User } from "../../generated/schema";
import { scoreDefault } from "../score";

export type PostReportId = string

export function postReportId(from: User, post: Post): PostReportId {
    return from.id + ":" + post.id
}