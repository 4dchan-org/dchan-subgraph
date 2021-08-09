import { BigInt, log } from "@graphprotocol/graph-ts";
import { Message } from "../../../generated/Relay/Relay";
import { User } from "../../../generated/schema";
import { isJanny } from "../../jannies";

export function userLoadOrCreate(message: Message): User {
    let txFrom = message.transaction.from.toHexString()

    log.info("Loading user: {}", [txFrom]);
    let user = User.load(txFrom);
    if (user == null) {
        log.info("Creating user: {}", [txFrom]);

        user = new User(txFrom)
        user.score = BigInt.fromI32(0)
    }
    user.isJanny = isJanny(txFrom)
    user.save()
    
    return user as User
}