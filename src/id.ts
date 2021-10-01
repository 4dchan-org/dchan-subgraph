import { ByteArray, crypto, ethereum } from "@graphprotocol/graph-ts";

export function shortUniqueId(longId: string): string {
    return shortId(uniqueId(longId))
}

export function uniqueId(longId: string): string {
    // array is 32 bytes long, need to shorten to 20
    // need to keep the first 2 and last 2 bytes the same
    // so that the shortened ID remains identical
    let array = crypto.keccak256(ByteArray.fromUTF8(longId))
    for (let i = 18; i < 30; i++) {
        // overlap bytes 18 to 30 onto bytes 2 to 14 via XOR
        array[i - 16] ^= array[i]
    }
    let arrayString = array.toHexString()
    // skip out the 12 bytes that were overlapped above
    return arrayString.slice(0, 38) + arrayString.slice(62, 66)
}

export function shortId(longId: string): string {
    return "0x"+longId.substr(2, 3)+longId.substr(-3, 3)
}

export function eventId(event: ethereum.Event): string {
    return event.transaction.hash.toHex() + "-" + event.logIndex.toString()
}