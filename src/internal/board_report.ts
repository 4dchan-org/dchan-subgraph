import { Board, User } from "../../generated/schema";

export type BoardReportId = string

export function boardReportId(from: User, board: Board): BoardReportId {
    return from.id + ":" + board.id
}