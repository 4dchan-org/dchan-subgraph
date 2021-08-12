import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Admin } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isAdmin } from "../jannies";
import { eventId } from "../utils";

export function adminGrant(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHex()
    let evtId = eventId(message)

    log.info("Admin grant attempt by {}: {}", [txFrom, evtId]);

    if(!isAdmin(txFrom)) {
        // Curses! Foiled again...
        return false
    }

    let address = ensureString(data.get("hex_address"))
    if(address.indexOf("0x") != -1) {
        log.info("Invalid admin grant request: {}", [evtId])

        return false
    }

    let admin = new Admin(address)
    admin.save()

    log.info("Admin granted to {}: {}", [txFrom, evtId]);

    return true
}