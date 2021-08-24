import { Message } from "../../generated/Relay/Relay";
import { eventId } from "../id";

export type BlockId = string

export function blockId(message: Message): BlockId {
    return eventId(message)
}