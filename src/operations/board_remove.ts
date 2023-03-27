import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts"
import { Message } from "../../generated/Relay/Relay"
import { User } from "../../generated/schema"
import { ensureString } from "../ensure"
import { isBoardJanny } from "../internal/board_janny"
import { eventId } from "../id"
import { loadBoardFromId } from "../internal/board"

export function boardRemove(
  message: Message,
  user: User,
  data: TypedMap<string, JSONValue>
): boolean {
  let maybeBoardId = ensureString(data.get("id"))
  let evtId = eventId(message)
  if (!maybeBoardId) {
    log.warning("Invalid board remove request: {}", [evtId])

    return false
  }

  let boardId = maybeBoardId as string
  log.debug("Requested board removal: {}", [boardId])

  let board = loadBoardFromId(boardId)
  if (!board) {
    log.warning("Board {} not found, skipping {}", [boardId, evtId])

    return false
  }

  if (board.createdBy != user.id && !isBoardJanny(user.id, boardId)) {
    log.warning("User {} is not janny of {}, skipping {}", [user.id, boardId, evtId])

    return false
  }

  log.debug("Removing board: {}", [boardId])

  store.remove("Board", boardId)

  log.info("Board removed: {}", [boardId])

  return true
}
