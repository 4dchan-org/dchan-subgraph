import { Message } from "../../generated/Relay/Relay"
import { User, UserRef } from "../../generated/schema"
import { shortUserIdFromUserId, userB58IdFromUserId } from "./user"

export function createUserRefs(user: User) : void {
    let ref: UserRef | null = null

    ref = new UserRef(shortUserIdFromUserId(user.id))
    ref.user = user.id
    ref.save()

    ref = new UserRef(userB58IdFromUserId(user.id))
    ref.user = user.id
    ref.save()
}