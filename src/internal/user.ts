import { log } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { User } from "../../generated/schema";
import { scoreDefault } from "../score";

export type UserId = string

export function userIdFromMessage(message: Message): UserId {
    return userIdFromHex(message.transaction.from.toHexString())
}

export function userIdFromHex(hexAddress: string): UserId {
    return hexAddress
}

export function userLoadOrCreate(message: Message): User {
    let uid = userIdFromMessage(message)

    log.info("Loading user: {}", [uid]);
    let user = User.load(uid);
    if (user == null) {
        log.info("Creating user: {}", [uid]);

        user = new User(uid)
        user.score = scoreDefault()
        user.address = message.transaction.from.toHex()
    }
    user.save()
    
    return user as User
}