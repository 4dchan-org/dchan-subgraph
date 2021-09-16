import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Admin, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { eventId } from "../id";
import { isAdmin } from "../internal/admin";
import { locateBlockFromMessage } from "../internal/block";

export function adminGrant(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)
    let block = locateBlockFromMessage(message)

    log.info("Admin grant attempt by {}: {}", [user.id, evtId]);

    if(!isAdmin(user)) {
        // Curses! Foiled again...
        return false
    }

    let hexAddress = ensureString(data.get("hex_address"))
    if(hexAddress.indexOf("0x") != -1) {
        log.info("Invalid admin grant request: {}", [evtId])

        return false
    }

    let admin = new Admin(hexAddress)
    admin.grantedAtBlock = block.id
    admin.grantedAt = block.timestamp
    admin.save()

    log.info("Admin granted to {}: {}", [user.id, evtId]);

    return true
}