import { Message } from "../../generated/Relay/Relay";
import { ChanStatus } from "../../generated/schema";

export function chanStatusId(message: Message): string {
    return message.transaction.to.toHexString()
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