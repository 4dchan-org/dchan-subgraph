import { Message } from "../../generated/Relay/Relay"
import { Report } from "../../generated/schema"
import { eventId } from "../id"
import { locateBlockFromMessage } from "./block"
import { userIdFromMessage } from "./user"

export type ReportId = string

export function reportId(message: Message): ReportId {
    return eventId(message)
}

export function createReport(message: Message, reason: string): Report {
    let block = locateBlockFromMessage(message)

    let id = reportId(message)
    let report = new Report(id)
    report.reason = reason
    report.createdAtBlock = block.id
    report.createdAt = block.timestamp
    report.from = userIdFromMessage(message)
    report.save()

    return report
}