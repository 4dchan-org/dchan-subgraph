import { Message } from "../../generated/Relay/Relay";
import { eventId, shortenId } from "../id";

export type ClientId = string

export function clientIdFromMessage(message: Message): ClientId {
    return shortenId(eventId(message))
}