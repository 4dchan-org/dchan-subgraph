import { ethereum, log } from "@graphprotocol/graph-ts"
import { ChanStatus } from "../generated/schema"

// This needs to go on chain asap
const op: string = "0x22a973417575E3EA73dD26220aeFe78c16742b33"
const jannies: string[] = [
    op
]

export function isAdmin(hexAddress: string): boolean {
    return hexAddress === op
}

export function isJanny(hexAddress: string): boolean {
    return jannies.indexOf(hexAddress) != -1
}

export function isDchanLocked(message: ethereum.Event): boolean {
    const chanId = message.transaction.to.toHexString()
    const chanStatus = ChanStatus.load(chanId)
    if(chanStatus == null) {
        log.error("Could not retrieve chan status", [chanId])
        return true
    }

    return chanStatus.isLocked
}