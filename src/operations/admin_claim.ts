import { log } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { Admin, User } from "../../generated/schema"
import { eventId } from "../id"
import { locateBlockFromMessage } from "../internal/block"

export const LOCK_KEY = "__admin_claimed"

export function adminClaim(message: Message, user: User): boolean {
    let evtId = eventId(message)
    let block = locateBlockFromMessage(message)

    log.info("Admin claim attempt by {}: {}", [user.id, evtId])

    // This acts as lock
    let admin = Admin.load(LOCK_KEY)
    if(admin != null) {
        log.warning("Admin claim attempt failed: {}", [evtId])

        return false
    }

    admin = new Admin(LOCK_KEY)
    admin.grantedAtBlock = block.id
    admin.grantedAt = block.timestamp
    admin.save()

    // Actual admin
    admin = new Admin(user.address)
    admin.grantedAtBlock = block.id
    admin.grantedAt = block.timestamp
    admin.save()

    log.info("Admin claimed by {}: {}", [user.id, evtId])

    return true
}