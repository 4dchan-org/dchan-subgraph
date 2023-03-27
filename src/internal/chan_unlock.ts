import { log } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { ChanStatus, User } from "../../generated/schema"
import { eventId } from "../id"
import { chanStatusId, isChanLocked } from "../internal/chan_status"
import { isAdmin } from "./admin"

export function chanUnlock(message: Message, user: User): boolean {
    let evtId = eventId(message)

    if(!isAdmin(user.id)) {
        log.warning("{} is not admin", [user.id])

        return false
    }

    if(!isChanLocked(message)) {
        log.warning("Dchan not locked, skipping {}", [evtId])

        return false
    }

    let chanId = chanStatusId(message)
    let chanStatus = ChanStatus.load(chanId)
    if(chanStatus !== null) {
        chanStatus.isLocked = false
        chanStatus.save()

        log.info("Dchan unlocked: {}", [chanId])
        
        return true
    } else {
        return false
    }
}