import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Client, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { eventId } from "../id";
import { isAdmin } from "../internal/admin";
import { clientIdFromMessage } from "../internal/client";
import { locateBlockFromMessage } from "../internal/block";

export function clientPublish(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)
    let block = locateBlockFromMessage(message)

    log.info("Client publish attempt by {}: {}", [user.id, evtId]);

    if (!isAdmin(user)) {
        // Curses! Foiled again...
        return false
    }

    let ipfsHash = ensureString(data.get("ipfs_hash"))
    let version = ensureString(data.get("version"))
    let channel = ensureString(data.get("channel"))
    if (ipfsHash == null || version == null) {
        log.info("Invalid client publish request: {}", [evtId])

        return false
    }

    let client = new Client(clientIdFromMessage(message))
    client.version = version as string
    client.ipfsHash = ipfsHash as string
    client.channel = channel != null ? channel as string : ""
    client.publishedAtBlock = block.id
    client.publishedAt = block.timestamp
    client.save()

    log.info("Client published {} version {}: {}", [ipfsHash as string, version as string, evtId]);

    return true
}