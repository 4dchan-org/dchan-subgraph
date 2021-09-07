import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Client, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { eventId } from "../id";
import { isAdmin } from "../internal/admin";
import { clientIdFromMessage } from "../internal/client";
import { createBlockFromMessage } from "../internal/block";

export function clientPublish(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)
    let block = createBlockFromMessage(message)

    log.info("Client publish attempt by {}: {}", [user.id, evtId]);

    if (!isAdmin(user.id)) {
        // Curses! Foiled again...
        return false
    }

    let ipfsHash = ensureString(data.get("ipfs_hash"))
    if (ipfsHash) {
        log.info("Invalid client publish request: {}", [evtId])

        return false
    }

    let client = new Client(clientIdFromMessage(message))
    client.ipfsHash = ipfsHash
    client.publishedAt = block.id
    client.save()

    log.info("Client published {}: {}", [ipfsHash, evtId]);

    return true
}