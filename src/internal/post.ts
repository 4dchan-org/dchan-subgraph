import { BigInt, log } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { User } from "../../generated/schema";

export type PostId = string

// export function userId(message: Message): UserId {
//     return userIdFromHex(message.transaction.from.toHexString())
// }