import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, BoardReport, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { scorePenalty } from "../score";
import { eventId } from "../id";
import { boardReportId } from "../internal/board_report";

export function boardReport(message: Message, user: User, data: TypedMap<string, JSONValue>): boolean {
    let evtId = eventId(message)

    let boardId = ensureString(data.get("id"))
    let reason = ensureString(data.get("reason"))
    if (boardId == null) {
        log.warning("Invalid board report request: {}", [evtId]);

        return false
    }

    log.debug("Reported board: {}", [boardId]);

    let board = Board.load(boardId)
    if (board == null) {
        log.warning("board {} not found, skipping {}", [boardId, evtId])

        return false
    }
    board.score = scorePenalty(board.score)
    board.save()

    let reportId = boardReportId(user, board as Board)
    let boardReport = BoardReport.load(reportId)
    if (boardReport == null) {
        boardReport = new BoardReport(reportId)
    }
    boardReport.reason = reason
    boardReport.board = board.id
    boardReport.from = user.id
    boardReport.save()

    return true
}