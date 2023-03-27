import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { Admin, User } from "../../generated/schema"
import { ensureString } from "../ensure"
import { eventId } from "../id"
import { isAdmin } from "../internal/admin"
import { locateBlockFromMessage } from "../internal/block"

export function adminGrant(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)
    let block = locateBlockFromMessage(message)

    log.info("Admin grant attempt by {}: {}", [user.id, evtId])

    if(!isAdmin(user.id)) {
        log.warning("Rejected admin grant requested by unprivileged user {}", [user.id])

        return false
    }

    let maybeHexAddress = ensureString(data.get("hex_address"))
    if(!maybeHexAddress) {
        log.warning("Invalid admin grant request: hex_address not provided", [])

        return false
    }

    let hexAddress = maybeHexAddress as string
    if(hexAddress.indexOf("0x") != 0 || hexAddress.length !== 42) {
        log.warning("Invalid admin grant request: {}", [evtId])

        return false
    }

    if(Admin.load(hexAddress) !== null) {
        log.warning("Admin already exists for {}: {}", [hexAddress, evtId])

        return false
    }

    let admin = new Admin(hexAddress)
    admin.grantedAtBlock = block.id
    admin.grantedAt = block.timestamp
    admin.save()

    log.info("Admin granted to {}: {}", [user.id, evtId])

    return true
}