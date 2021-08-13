import { log } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Ban, UserBan } from "../../generated/schema";
import { eventId } from "../id";
import { UserId } from "./user";
import { userBanId } from "./user_ban";

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