import { ByteArray, crypto, log } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { UserRef, User } from "../../generated/schema";
import { scoreDefault } from "../score";
import { createUserRefs } from "../internal/user_ref"

export type UserId = string

export function userIdFromMessage(message: Message): UserId {
    return message.transaction.from.toHexString()
}

export function shortUserIdFromMessage(message: Message): UserId {
    let hexAddress = userIdFromMessage(message)
    return "0x"+hexAddress.substr(2, 3)+hexAddress.substr(-3, 3)
}

export function userB58IdFromMessage(message: Message): UserId {
    let buffer = crypto.keccak256(ByteArray.fromHexString(userIdFromMessage(message)));
    for (let i = 8; i < 32; i++) {
      buffer[i % 8] ^= buffer[i];
    }
    return buffer.toBase58().slice(0, 8)
}

export function loadUserFromId(id: UserId) : User | null {
    let userRef = UserRef.load(id)
    let userId: string = userRef != null && userRef.user !== null ? userRef.user as string : id

    return User.load(userId)
}

export function locateUserFromMessage(message: Message): User {
    let uid = userIdFromMessage(message)

    log.info("Loading user: {}", [uid]);
    let user = loadUserFromId(uid);
    if (user == null) {
        log.info("Creating user: {}", [uid]);

        let hexAddress = message.transaction.from.toHex()

        user = new User(uid)
        user.score = scoreDefault()
        user.address = hexAddress
        user.b58id = userB58IdFromMessage(message)
        user.save()
        
        createUserRefs(message, user as User)
    }
    
    return user as User
}