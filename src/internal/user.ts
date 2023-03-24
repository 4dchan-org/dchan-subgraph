import { ByteArray, crypto, log } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { UserRef, User } from "../../generated/schema"
import { scoreDefault } from "../score"
import { createUserRefs } from "../internal/user_ref"

export type UserId = string

export function userIdFromMessage(message: Message): UserId {
    return message.params.from.toHexString()
}

export function shortUserIdFromUserId(userId: UserId): UserId {
    return "0x"+userId.substring(2, 3)+userId.substring(-3, 3)
}

export function userB58IdFromUserId(userId: UserId): UserId {
    let buffer = crypto.keccak256(ByteArray.fromHexString(userId))
    for (let i = 8; i < 32; i++) {
      buffer[i % 8] ^= buffer[i]
    }
    return buffer.toBase58().slice(0, 8)
}

export function locateUserFromId(id: UserId) : User | null {
    let userRef = UserRef.load(id)
    let userId: string = userRef != null && userRef.user !== null ? userRef.user as string : id

    let user = User.load(userId)
    if (user == null) {
        log.info("Creating user: {}", [userId])

        user = new User(userId)
        user.score = scoreDefault()
        user.address = userId
        user.hexAddress = userId
        user.b58id = userB58IdFromUserId(userId)
        user.save()
        
        createUserRefs(user as User)
    }

    return user as User;
}

export function locateUserFromMessage(message: Message): User {
    let uid = userIdFromMessage(message)

    log.info("Loading user: {}", [uid])
    let user = locateUserFromId(uid)
    
    return user as User
}