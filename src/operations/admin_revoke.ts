import { BigInt, JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Admin } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isAdmin } from "../jannies";
import { eventId } from "../utils";

export function adminRevoke(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from.toHex()
    let evtId = eventId(message)

    log.info("Admin revoke attempt by {}: {}", [txFrom, evtId]);

    if(!isAdmin(txFrom)) {
        // Curses! Foiled again...
        return false
    }

    let address = ensureString(data.get("hex_address"))
    if(address.indexOf("0x") != -1) {
        log.info("Invalid admin revoke request: {}", [evtId])

        return false
    }

    store.remove("Admin", address)

    log.info("Admin {} revoked by {}: {}", [address, txFrom, evtId]);

    return true
}