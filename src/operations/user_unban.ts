import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { Ban, User, UserBan } from "../../generated/schema"
import { ensureString } from "../ensure"
import { eventId } from "../id"
import { isAdmin } from "../internal/admin"
import { locateUserFromId } from "../internal/user"
import { userBanId, userIsBanned } from "../internal/user_ban"

export function userUnban(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    if(!isAdmin(user.id)) {
        log.info("Unauthorized, skipping {}", [evtId])

        return false
    }
    
    let maybeBannedUserId = ensureString(data.get("id"))
    if (maybeBannedUserId == null) {
        log.info("Invalid user unban request: {}", [evtId])

        return false
    }

    let bUserId = maybeBannedUserId as string
    log.info("Unbanning user: {}", [bUserId])
    
    let bUser = locateUserFromId(bUserId)
    if (bUser == null) {
        log.info("User {} not found", [bUserId])

        return false
    }

    if(!userIsBanned(message, bUserId)) {
        log.info("User {} is not banned", [bUserId])

        return false
    }

    let userBan = UserBan.load(userBanId(bUserId))
    let ban = userBan ? Ban.load(userBan.ban) : null
    if(ban) {
        ban.expiresAt = message.block.timestamp
        ban.save()

        log.info("User {} unbanned", [bUserId])
        
        return true
    } else {
        log.info("Ban {} not found", [userBan ? userBan.ban : ""])

        return false
    }
}