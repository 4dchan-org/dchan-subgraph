import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { ensureString } from "../ensure"
import { eventId } from "../id"
import { User } from "../../generated/schema"
import { isAdmin } from "../internal/admin"

export function adminRevoke(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    log.info("Admin revoke attempt by {}: {}", [user.id, evtId])

    if(!isAdmin(user)) {
        log.warning("Rejected admin revoke requested by unprivileged user {}", [user.id])

        return false
    }

    let maybeHexAddress = ensureString(data.get("hex_address"))
    if(!maybeHexAddress) {
        log.warning("Invalid admin revoke request: hex_address not provided", [])

        return false
    }

    let hexAddress = maybeHexAddress as string
    if(hexAddress.indexOf("0x") != 0) {
        log.warning("Invalid admin revoke request: {}", [evtId])

        return false
    }

    store.remove("Admin", hexAddress)

    log.info("Admin {} revoked by {}: {}", [hexAddress, user.id, evtId])

    return true
}