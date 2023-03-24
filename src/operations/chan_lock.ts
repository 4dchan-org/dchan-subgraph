import { log } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { ChanStatus, User } from "../../generated/schema"
import { eventId } from "../id"
import { isAdmin } from "../internal/admin"
import { chanStatusId, isChanLocked } from "../internal/chan_status"

export function chanLock(message: Message, user: User): boolean {
    let evtId = eventId(message)

    if(!isAdmin(user)) {
        log.warning("{} is not admin", [user.id])

        return false
    }

    if(isChanLocked(message)) {
        log.warning("Chan already locked, skipping {}", [evtId])

        return false
    }

    let chanId = chanStatusId(message)
    let chanStatus = ChanStatus.load(chanId)
    if(chanStatus !== null) {
        chanStatus.isLocked = true
        chanStatus.save()

        log.info("Chan locked: {}", [chanId])
        
        return true
    } else {
        return false
    }
}