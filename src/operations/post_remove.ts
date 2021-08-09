import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Post, Thread } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isJanny } from "../jannies";
import { eventId } from "../utils";

export function postRemove(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHexString()

    let postId = ensureString(data.get("id"))
    let evtId = eventId(message)
    if(postId == null) {
        log.warning("Invalid post remove request: {}", [evtId]);

        return false
    }

    log.debug("Requested post removal: {}", [postId]);
    
    let post = Post.load(postId)
    if (post == null) {
        log.warning("Post {} not found, skipping", [postId])

        return false
    }

    if((post.from != txFrom) && !isJanny(txFrom)) {
        log.warning("Post not owned by {}, skipping", [txFrom])

        return false
    }
    
    log.debug("Removing post: {}", [postId])

    store.remove('Post', postId)

    let thread = Thread.load(postId)
    if (thread != null) {
        // @TODO This does not work. `Value is not an array.`
        // log.info("Post is thread, removing replies", [txFrom])

        // let replies = thread.replies
        // if (replies != null) {
        //     replies.forEach(replyId => {
        //         log.debug("Removing post: {}", [replyId])

        //         store.remove('Post', replyId)

        //         log.info("Post removed: {}", [replyId])
        //     })
        // } else {
        //     log.debug("No replies", [])
        // }

        store.remove('Thread', postId)

        log.info("Thread removed: {}", [postId])
    } else {
        log.info("Post removed: {}", [postId])
    }

    return true
}