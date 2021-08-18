import { BigInt } from "@graphprotocol/graph-ts"

export function scoreDefault(): BigInt {
    return BigInt.fromI32(1_000_000_000)
}

export function scorePenalty(score: BigInt): BigInt {
    return score.times(BigInt.fromI32(90)).div(BigInt.fromI32(100)) // * 0.9
}