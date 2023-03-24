import { Message } from "../../generated/Relay/Relay"
import { Board, BoardRef } from "../../generated/schema"
import { eventId } from "../id"
import { shortBoardId } from "./board"

export function createBoardRefs(message: Message, board: Board) : void {
    let ref: BoardRef | null = null

    ref = new BoardRef(eventId(message))
    ref.board = board.id
    ref.save()

    ref = new BoardRef(shortBoardId(message))
    ref.board = board.id
    ref.save()
}