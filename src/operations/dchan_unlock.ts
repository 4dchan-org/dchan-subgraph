import { log } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { ChanStatus } from "../../generated/schema";
import { isAdmin, isDchanLocked } from "../jannies";
import { eventId } from "../utils";

export function dchanUnlock(message: Message): boolean {
    let txFrom = message.transaction.from.toHexString()
    let evtId = eventId(message)

    if(!isAdmin(txFrom)) {
        log.warning("{} is not admin", [txFrom])

        return false
    }

    if(!isDchanLocked(message)) {
        log.warning("Dchan not locked, skipping {}", [evtId])

        return false
    }

    let chanId = message.transaction.to.toHexString()
    let chanStatus = ChanStatus.load(chanId)
    chanStatus.isLocked = false
    chanStatus.save()

    log.info("Dchan unlocked: {}", [chanId])
    
    return true
}