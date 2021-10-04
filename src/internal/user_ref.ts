import { Message } from "../../generated/Relay/Relay";
import { User, UserRef } from "../../generated/schema";
import { shortUserIdFromMessage, userB58IdFromMessage } from "./user";

export function createUserRefs(message: Message, user: User) : void {
    let ref: UserRef | null = null

    ref = new UserRef(shortUserIdFromMessage(message))
    ref.user = user.id
    ref.save()

    ref = new UserRef(userB58IdFromMessage(message))
    ref.user = user.id
    ref.save()
}