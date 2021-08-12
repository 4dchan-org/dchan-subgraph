import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Admin, Board } from "../../generated/schema";
import { ensureBoolean, ensureString } from "../ensure";
import { eventId } from "../utils";
import { userLoadOrCreate } from "./internal/user_load_or_create";

const ADMIN_ID = "op"

export function adminClaim(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txFrom = message.transaction.from
    let evtId = eventId(message)

    log.info("Admin claim attempt by {}: {}", [txFrom.toHex(), evtId]);

    // This acts as flag
    let admin = Admin.load(ADMIN_ID)
    if(admin != null) {
        log.info("Admin claim attempt failed: {}", [evtId]);

        return false
    }
    admin = new Admin(ADMIN_ID)
    admin.save()

    // Actual admin
    admin = new Admin(txFrom.toHexString())
    admin.save()

    log.info("Admin claimed by {}: {}", [txFrom.toHex(), evtId]);

    return true
}