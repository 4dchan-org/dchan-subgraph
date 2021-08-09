import { ethereum, log } from "@graphprotocol/graph-ts"
import { ChanStatus } from "../generated/schema"

// This needs to go on chain asap
let op: string = "0x22a973417575E3EA73dD26220aeFe78c16742b33"
let jannies: string[] = [
    op
]

export function isAdmin(hexAddress: string): boolean {
    return hexAddress === op
}

export function isJanny(hexAddress: string): boolean {
    return jannies.indexOf(hexAddress) != -1
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