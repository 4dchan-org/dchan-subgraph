import { Message } from "../../generated/Relay/Relay";
import { ChanStatus } from "../../generated/schema";
import { shortUniqueId } from "../id";

export function chanStatusId(message: Message): string {
  let to = message.transaction.to
  let hash = message.transaction.hash
  if(to !== null) {
    return to.toHexString()
  } else {
    // @HACK This should never happen. We fall back to the tx hash but it's NOT a valid value. 
    return hash.toHexString()
  }
}

export function locateChanStatusFromMessage(message: Message): ChanStatus {
  let chanId = chanStatusId(message)

  let chanStatus = ChanStatus.load(chanId)
  if (chanStatus == null) {
    chanStatus = new ChanStatus(chanId)
    chanStatus.isLocked = false
    chanStatus.save()
  }

  return chanStatus as ChanStatus
}

export function isChanLocked(message: Message): boolean {
    let chanStatus = locateChanStatusFromMessage(message)

    return chanStatus.isLocked
}