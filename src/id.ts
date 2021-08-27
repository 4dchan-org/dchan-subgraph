import { ByteArray, crypto, ethereum } from "@graphprotocol/graph-ts";

export function shortenId(longId: string): string {
    let id = crypto.keccak256(ByteArray.fromUTF8(longId)).toHexString()
    return "0x"+id.substr(2, 3)+id.substr(-3, 3)
}

export function eventId(event: ethereum.Event): string {
    return event.transaction.hash.toHex() + "-" + event.logIndex.toString()
}