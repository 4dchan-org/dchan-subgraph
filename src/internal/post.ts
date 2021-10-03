import { Message } from "../../generated/Relay/Relay";
import { Post, PostRef } from "../../generated/schema";
import { eventId, shortUniqueId, txId } from "../id";

export type PostId = string

export function postId(message: Message): PostId {
    return txId(message)
}

export function shortPostId(message: Message): PostId {
    return shortUniqueId(eventId(message))
}

export function loadPostFromId(id: PostId) : Post | null {
    let post : Post | null = null;
    
    let postRef = PostRef.load(id)
    if(postRef != null) {
        post = Post.load(postRef.post)
    } else {
        post = Post.load(id)
    }

    return post
}