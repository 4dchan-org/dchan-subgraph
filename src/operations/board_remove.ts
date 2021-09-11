import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board, User } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isBoardJanny } from "../internal/board_janny";
import { eventId } from "../id";
import { loadBoardFromId } from "../internal/board";

export function boardRemove(
  message: Message, 
  user: User,
  data: TypedMap<string, JSONValue>
): boolean {
  let boardId = ensureString(data.get("id"));
  let evtId = eventId(message)
  if(boardId == null) {
      log.warning("Invalid board remove request: {}", [evtId]);

      return false
  }

  log.debug("Requested board removal: {}", [boardId]);

  let board = loadBoardFromId(boardId)
  if (board == null) {
    log.warning("Board {} not found, skipping {}", [boardId, evtId]);

    return false;
  }

  if (board.createdBy != user.id && !isBoardJanny(user, boardId)) {
    log.warning("User {} is not janny of {}, skipping {}", [user.id, boardId, evtId])

    return false;
  }

  log.debug("Removing board: {}", [boardId]);

  store.remove("Board", boardId);

  log.info("Board removed: {}", [boardId]);

  return true;
}
