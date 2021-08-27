import { ethereum } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { ChanStatus } from "../../generated/schema";

export function chanStatusId(message: Message): string {
    return message.transaction.to.toHexString()
}

export function isChanLocked(message: ethereum.Event): boolean {
    let chanId = message.transaction.to.toHexString()

    let chanStatus = ChanStatus.load(chanId)
    if (chanStatus == null) {
      chanStatus = new ChanStatus(chanId)
      chanStatus.isLocked = false
      chanStatus.save()
    }

    return chanStatus.isLocked
}