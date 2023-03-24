import { Message } from "../../generated/Relay/Relay"
import { Board, BoardReport, User } from "../../generated/schema"
import { createReport } from "./report"

export type BoardReportId = string

export function boardReportId(from: User, board: Board): BoardReportId {
    return from.id + ":" + board.id
}

export function createBoardReport(message: Message, user: User, board: Board, reason: string): BoardReport {
    let report = createReport(message, reason)
    let id = boardReportId(user, board as Board)
    
    let boardReport = new BoardReport(id)
    boardReport.board = board.id
    boardReport.report = report.id
    boardReport.save()

    return boardReport
}