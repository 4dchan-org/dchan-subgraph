import { Message } from "../../generated/Relay/Relay";
import { eventId, uniqueId } from "../id";

export type ClientId = string

export function clientIdFromMessage(message: Message): ClientId {
    return uniqueId(eventId(message))
}