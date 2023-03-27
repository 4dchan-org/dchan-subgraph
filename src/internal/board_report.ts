import { Message } from "../../generated/Relay/Relay"
import { Board, BoardReport, User } from "../../generated/schema"
import { BoardId } from "./board"
import { createReport } from "./report"
import { UserId } from "./user"

export type BoardReportId = string

export function boardReportId(fromId: UserId, boardId: BoardId): BoardReportId {
    return fromId + ":" + boardId
}

export function createBoardReport(message: Message, user: User, board: Board, reason: string): BoardReport {
    let report = createReport(message, reason)
    let id = boardReportId(user.id, board.id)
    
    let boardReport = new BoardReport(id)
    boardReport.board = board.id
    boardReport.report = report.id
    boardReport.save()

    return boardReport
}