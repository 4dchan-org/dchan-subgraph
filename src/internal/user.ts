import { log } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { User } from "../../generated/schema";
import { scoreDefault } from "../score";

export type UserId = string

export function userIdFromMessage(message: Message): UserId {
    return userIdFromHexAddress(message.transaction.from.toHexString())
}

export function userIdFromHexAddress(hexAddress: string): UserId {
    return "0x"+hexAddress.substr(2, 3)+hexAddress.substr(-3, 3)
}

export function locateUserFromMessage(message: Message): User {
    let uid = userIdFromMessage(message)

    log.info("Loading user: {}", [uid]);
    let user = User.load(uid);
    if (user == null) {
        log.info("Creating user: {}", [uid]);

        user = new User(uid)
        user.score = scoreDefault()
        user.address = message.transaction.from.toHex()
        user.save()
    }
    
    return user as User
}