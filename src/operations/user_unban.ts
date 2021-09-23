import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Ban, User, UserBan } from "../../generated/schema";
import { ensureString } from "../ensure";
import { eventId } from "../id";
import { isAdmin } from "../internal/admin";
import { loadUserFromId } from "../internal/user";
import { userBanId, userIsBanned } from "../internal/user_ban";

export function userUnban(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    if(!isAdmin(user)) {
        log.info("Unauthorized, skipping {}", [evtId])

        return false
    }
    
    let bUserId = ensureString(data.get("id"))
    if (bUserId == null) {
        log.info("Invalid user unban request: {}", [evtId]);

        return false
    }

    log.info("Unbanning user: {}", [bUserId]);
    
    let bUser = loadUserFromId(bUserId)
    if (bUser == null) {
        log.info("User {} not found", [bUserId]);

        return false
    }

    if(!userIsBanned(message, bUserId)) {
        log.info("User {} is not banned", [bUserId]);

        return false
    }

    let userBan = UserBan.load(userBanId(bUserId))
    let ban = Ban.load(userBan.ban)
    ban.expiresAt = message.block.timestamp
    ban.save()

    log.info("User {} unbanned", [bUserId])
    
    return true
}