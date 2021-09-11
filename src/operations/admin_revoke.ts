import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { ensureString } from "../ensure";
import { eventId } from "../id";
import { userIdFromHex } from "../internal/user";
import { User } from "../../generated/schema";
import { isAdmin } from "../internal/admin";

export function adminRevoke(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    log.info("Admin revoke attempt by {}: {}", [user.id, evtId]);

    if(!isAdmin(user)) {
        // Curses! Foiled again...
        return false
    }

    let hexAddress = ensureString(data.get("hex_address"))
    if(hexAddress.indexOf("0x") != -1) {
        log.info("Invalid admin revoke request: {}", [evtId])

        return false
    }

    store.remove("Admin", userIdFromHex(hexAddress))

    log.info("Admin {} revoked by {}: {}", [hexAddress, user.id, evtId]);

    return true
}