import { log } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Admin, User } from "../../generated/schema";
import { eventId } from "../id";

const ADMIN_ID = "op"

export function adminClaim(message: Message, user: User): boolean {
    let evtId = eventId(message)

    log.info("Admin claim attempt by {}: {}", [user.id, evtId]);

    // This acts as lock
    let admin = Admin.load(ADMIN_ID)
    if(admin != null) {
        log.info("Admin claim attempt failed: {}", [evtId]);

        return false
    }
    admin = new Admin(ADMIN_ID)
    admin.save()

    // Actual admin
    admin = new Admin(user.id)
    admin.save()

    log.info("Admin claimed by {}: {}", [user.id, evtId]);

    return true
}