import { Message } from "../../generated/Relay/Relay"
import { eventId, shortUniqueId } from "../id"

export type ClientId = string

export function clientIdFromMessage(message: Message): ClientId {
    return shortUniqueId(eventId(message))
}