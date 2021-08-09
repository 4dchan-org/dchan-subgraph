import { BigInt, JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board } from "../../generated/schema";
import { ensureString } from "../ensure";
import { eventId } from "../utils";
import { userLoadOrCreate } from "./internal/user_load_or_create";

export function boardCreate(message: Message, data: TypedMap<string, JSONValue>): boolean {
    let txId = message.transaction.hash.toHexString()
    let evtId = eventId(message)

    log.info("Creating board: {}", [txId]);

    let user = userLoadOrCreate(message)

    // { "name": "dchan", "title": "dchan.network" }
    let name = ensureString(data.get("name"))
    let title = ensureString(data.get("title"))

    if (name != null && title != null) {
        let board = new Board(evtId)
        board.name = name
        board.title = title
        board.postCount = BigInt.fromI32(0)
        board.score = BigInt.fromI32(0)
        board.createdBy = user.id
        
        user.save()
        board.save()

        log.info("Board created: {}", [txId]);

        return true
    } else {
        log.warning("Invalid board", [])

        return false
    }
}