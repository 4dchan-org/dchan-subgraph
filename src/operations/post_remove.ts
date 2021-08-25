import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Post, Thread, User } from "../../generated/schema";
import { ensureArray, ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";

export function postRemove(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)
    let postIdValues = ensureArray(data.get("ids"))
    if(postIdValues == null) {
        postIdValues = []

        let maybeThreadId = data.get("id")
        if (maybeThreadId !== null) {
            postIdValues = [maybeThreadId as JSONValue]
        }
    }

    if(!postIdValues.length) {
        log.warning("Invalid post remove request: {}", [evtId]);

        return false
    }

    // Check
    for (let i = 0; i < postIdValues.length; i++) {
        let postId: string = ensureString((postIdValues as JSONValue[])[i])
        
        if(postId == null) {
            log.warning("Invalid post remove request: {}", [evtId]);
            
            return false
        }

        log.debug("Requested post removal: {}", [postId]);

        let post = Post.load(postId)
        if (post == null) {
            log.warning("Post {} not found, skipping {}", [postId, evtId])

            return false
        }

        if ((post.from != user.id) && !isBoardJanny(user.id, post.board)) {
            log.warning("Post {} not owned by {}, skipping {}", [postId, user.id, evtId])

            return false
        }
    }

    for (let i = 0; i < postIdValues.length; i++) {
        let postId: string = ensureString((postIdValues as JSONValue[])[i])
        let thread = Thread.load(postId)
        if (thread != null) {
            store.remove('Thread', thread.id)
        }

        log.debug("Removing post: {}", [postId])

        store.remove('Post', postId)

        log.info("Post removed: {}", [postId])
    }

    return true
}