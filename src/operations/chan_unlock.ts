import { log } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { ChanStatus, User } from "../../generated/schema";
import { eventId } from "../id";
import { isAdmin } from "../internal/admin";
import { isChanLocked } from "../internal/chan_status";

export function chanUnlock(message: Message, user: User): boolean {
    let evtId = eventId(message)

    if(!isAdmin(user.id)) {
        log.warning("{} is not admin", [user.id])

        return false
    }

    if(!isChanLocked(message)) {
        log.warning("Chan not locked, skipping {}", [evtId])

        return false
    }

    let chanId = message.transaction.to.toHexString()
    let chanStatus = ChanStatus.load(chanId)
    chanStatus.isLocked = false
    chanStatus.save()

    log.info("Chan unlocked: {}", [chanId])
    
    return true
}