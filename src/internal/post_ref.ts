import { Message } from "../../generated/Relay/Relay";
import { Post, PostRef } from "../../generated/schema";
import { shortId } from "../id";

export function createPostRef(message: Message, post: Post): PostRef {
    let ref = new PostRef(shortId(post.from) + "/" + post.n.toString())
    ref.post = post.id
    ref.save()

    return ref
}