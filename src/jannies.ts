import { ethereum, log } from "@graphprotocol/graph-ts"
import { Admin, ChanStatus } from "../generated/schema"

export function isAdmin(hexAddress: string): boolean {
    let admin = Admin.load(hexAddress)
    return admin != null
}

// Alias for now
export function isJanny(hexAddress: string): boolean {
    return isAdmin(hexAddress)
}

export function isDchanLocked(message: ethereum.Event): boolean {
    let chanId = message.transaction.to.toHexString()
    let chanStatus = ChanStatus.load(chanId)
    if(chanStatus == null) {
        log.error("Could not retrieve chan status", [chanId])
        return true
    }

    return chanStatus.isLocked
}