import { BigInt } from "@graphprotocol/graph-ts"

export function scoreDefault(): BigInt {
    return BigInt.fromI32(1_000_000_000)
}

export function scorePenalize(score: BigInt): BigInt {
    return score.div(BigInt.fromI32(100)).times(BigInt.fromI32(90))
}