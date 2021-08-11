import { JSONValue, log, BigInt, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Post, PostBan, User } from "../../generated/schema";
import { ensureNumber, ensureString } from "../ensure";
import { isJanny } from "../jannies";
import { eventId } from "../utils";

export function postBan(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHexString()
    
    let postId = ensureString(data.get("id"))
    let reason = ensureString(data.get("reason"))
    let seconds = ensureNumber(data.get("seconds"))
    let evtId = eventId(message)
    if (postId == null || reason == null || seconds == null) {
        log.warning("Invalid user ban request: {}", [evtId]);

        return false
    }
    
    let post = Post.load(postId)
    if (post == null) {
        log.warning("Post {} not found", [postId]);

        return false
    }

    let userId = post.from
    log.info("Banning user: {}", [userId]);
    
    let user = User.load(userId)
    if (user == null) {
        log.warning("User {} not found", [userId]);

        return false
    }

    if(!isJanny(txFrom)) {
        log.warning("Unauthorized, skipping {}", [evtId])

        return false
    }

    let banExpiresAt: BigInt = message.block.timestamp.plus(seconds as BigInt)
    if(user.banExpiresAt.gt(banExpiresAt)) {
        log.info("User {} already banned, skipping {}", [userId, evtId])

        return false
    }
    user.banExpiresAt = banExpiresAt
    user.save()

    let postBan = new PostBan(userId+":"+postId)
    postBan.user = userId
    postBan.post = postId
    postBan.seconds = seconds as BigInt
    postBan.reason = reason
    postBan.from = message.transaction.from
    postBan.save()

    log.info("User {} banned until {}", [userId, banExpiresAt.toString()])
    
    return true
}