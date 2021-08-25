import { ByteArray, crypto, ethereum } from "@graphprotocol/graph-ts";

export function shortenId(longId: string): string {
    let id = crypto.keccak256(ByteArray.fromUTF8(longId)).toHexString()
    return "0x"+id.substr(2, 4)+id.substr(-4, 4)
}

export function eventId(event: ethereum.Event): string {
    return shortenId(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
}