import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Ban, User, UserBan } from "../../generated/schema";
import { ensureNumber, ensureString } from "../ensure";
import { scorePenalize } from "../score";
import { eventId } from "../id";
import { userBanId } from "../internal/user_ban";
import { banId } from "../internal/ban";
import { isAdmin } from "../internal/admin";

export function userBan(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)
    
    if(!isAdmin(user.id)) {
        log.warning("Unauthorized, skipping {}", [evtId])
        
        return false
    }
    
    let userId = ensureString(data.get("id"))
    if (userId == null) {
        log.warning("Invalid user ban request: {}", [evtId]);

        return false
    }

    log.info("Banning user: {}", [userId]);
    
    let bUser = User.load(userId)
    if (bUser == null) {
        log.warning("User {} not found", [userId]);

        return false
    }

    let reason = ensureString(data.get("reason"))
    let seconds = ensureNumber(data.get("seconds"))
    if(seconds == null) {
        seconds = BigInt.fromI32(1_000_000_000)
    }

    let banExpiresAt: BigInt = message.block.timestamp.plus(seconds as BigInt)
    log.debug("Banning user {} until {}...", [userId, banExpiresAt.toString()])

    let ubId = userBanId(userId)
    let userBan = UserBan.load(ubId)
    if(userBan == null) {
        let ban = new Ban(banId(message))
        ban.user = userId
        ban.expiresAt = banExpiresAt
        ban.reason = reason
        ban.save()

        userBan = new UserBan(ubId)
        userBan.user = userId
        userBan.ban = ban.id
        userBan.save()
    } else {
        let ban = Ban.load(userBan.ban)
        if(ban.expiresAt.gt(banExpiresAt)) {
            log.info("User {} already banned until {}, skipping {}", [userId, evtId])

            return false
        }
        ban.expiresAt = banExpiresAt
        ban.save()
    }

    user.score = scorePenalize(user.score)
    user.save()

    log.info("User {} banned until {}", [userId, banExpiresAt.toString()])
    
    return true
}