import { Message } from "../../generated/Relay/Relay";
import { Post, PostCreationEvent } from "../../generated/schema";
import { eventId, shortUniqueId } from "../id";

export type PostId = string

export function postId(message: Message): PostId {
    return shortUniqueId(eventId(message))
}

export function loadPostFromId(id: PostId) : Post | null {
    let post : Post | null = null;
    let postCreationEvent = PostCreationEvent.load(id)
    if(postCreationEvent != null) {
        post = Post.load(postCreationEvent.post)
    } else {
        post = Post.load(id)
    }

    return post
}