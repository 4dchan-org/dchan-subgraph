import { log } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { UserRef, User } from "../../generated/schema";
import { scoreDefault } from "../score";

export type UserId = string

export function userIdFromMessage(message: Message): UserId {
    return message.transaction.from.toHexString()
}

export function loadUserFromId(id: UserId) : User | null {
    let user : User | null = null;
    
    let userRef = UserRef.load(id)
    if(userRef != null) {
        user = User.load(userRef.user)
    } else {
        user = User.load(id)
    }

    return user
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
        user.save()

        let userRef = new UserRef("0x"+hexAddress.substr(2, 3)+hexAddress.substr(-3, 3))
        userRef.user = user.id
        userRef.save()
    }
    
    return user as User
}