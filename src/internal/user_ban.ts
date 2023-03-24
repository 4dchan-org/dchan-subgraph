import { Message } from "../../generated/Relay/Relay"
import { UserBan } from "../../generated/schema"
import { banExpired } from "./ban"
import { UserId } from "./user"

export type UserBanId = string

export function userBanId(userId: UserId): UserBanId {
    return userId
}

export function userIsBanned(message: Message, userId: UserId): boolean {
    let userBan = UserBan.load(userBanId(userId))
    if (userBan == null) {
        return false
    }

    return banExpired(message, userBan.ban)
}