import { JSONValue, log, store, TypedMap } from "@graphprotocol/graph-ts";
import { Message } from "../../generated/Relay/Relay";
import { Board } from "../../generated/schema";
import { ensureString } from "../ensure";
import { isJanny } from "../jannies";
import { eventId } from "../utils";

export function boardRemove(
  message: Message,
  data: TypedMap<string, JSONValue>
): boolean {
  let txFrom = message.transaction.from.toHexString();

  let boardId = ensureString(data.get("id"));
  let evtId = eventId(message)
  if(boardId == null) {
      log.warning("Invalid board remove request: {}", [evtId]);

      return false
  }

  log.debug("Requested board removal: {}", [boardId]);

  let board = Board.load(boardId);
  if (board == null) {
    log.warning("Board not found, skipping", [boardId]);

    return false;
  }

  if (board.createdBy != txFrom && !isJanny(txFrom)) {
    log.warning("Board not owned by {}, skipping", [txFrom]);

    return false;
  }

  log.debug("Removing board: {}", [boardId]);

  store.remove("Board", boardId);

  log.info("Board removed: {}", [boardId]);

  return true;
}
