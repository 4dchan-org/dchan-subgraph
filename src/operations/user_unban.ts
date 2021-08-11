import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isJanny } from "../jannies";
import { eventId } from "../utils";

export function userUnban(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHexString()
    
    let userId = ensureString(data.get("id"))
    let evtId = eventId(message)
    if (userId == null) {
        log.warning("Invalid user unban request: {}", [evtId]);

        return false
    }

    log.info("Unbanning user: {}", [userId]);
    
    let user = User.load(userId)
    if (user == null) {
        log.warning("User {} not found", [userId]);

        return false
    }

    if(!isJanny(txFrom)) {
        log.warning("Unauthorized, skipping {}", [evtId])

        return false
    }

    user.banExpiresAt = message.block.timestamp
    user.save()

    log.info("User {} unbanned", [userId])
    
    return true
}