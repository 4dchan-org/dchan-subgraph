import { log } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { Ban } from "../../generated/schema"
import { eventId } from "../id"

export type BanId = string

export function banId(message: Message): BanId {
    return eventId(message)
}

export function banExpired(message: Message, banId: BanId): boolean {
    let ban = Ban.load(banId)
    if (ban == null) {
        log.error("Ban {} for board ban {} not found?", [])

        return false
    }
    
    return ban.expiresAt.gt(message.block.timestamp)
}