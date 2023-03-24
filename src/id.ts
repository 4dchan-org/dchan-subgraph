import { ByteArray, crypto, ethereum } from "@graphprotocol/graph-ts"

export function shortUniqueId(longId: string): string {
    return shortId(crypto.keccak256(ByteArray.fromUTF8(longId)).toHexString())
}

export function shortId(longId: string): string {
    return "0x"+longId.substr(2, 3)+longId.substr(-3, 3)
}

export function eventId(event: ethereum.Event): string {
    return txId(event) + "-" + event.logIndex.toString()
}

export function txId(event: ethereum.Event): string {
    return event.transaction.hash.toHex()
}