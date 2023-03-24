import { Message } from "../../generated/Relay/Relay"
import { Post, PostRef } from "../../generated/schema"
import { eventId, shortId } from "../id"
import { shortPostId } from "./post"

export function createPostRefs(message: Message, post: Post) : void {
    let ref: PostRef | null = null

    ref = new PostRef(shortId(post.from) + "/" + post.n.toString())
    ref.post = post.id
    ref.save()

    ref = new PostRef(eventId(message))
    ref.post = post.id
    ref.save()

    ref = new PostRef(shortPostId(message))
    ref.post = post.id
    ref.save()
}