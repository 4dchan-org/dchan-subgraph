import { Message } from "../../generated/Relay/Relay";
import { eventId, shortenId } from "../id";

export type UserId = string

export function clientIdFromMessage(message: Message): UserId {
    return shortenId(eventId(message))
}