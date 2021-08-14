import { ByteArray, Bytes, ipfs, json, JSONValue, log, TypedMap } from '@graphprotocol/graph-ts';
import { Message } from '../generated/Relay/Relay'
import { ChanStatus, User } from '../generated/schema'
import { ensureObject, ensureString } from './ensure'

import { adminClaim } from './operations/admin_claim';
import { adminGrant } from './operations/admin_grant';
import { adminRevoke } from './operations/admin_revoke';
import { boardCreate } from './operations/board_create';
import { boardLock } from './operations/board_lock';
import { boardRemove } from './operations/board_remove';
import { boardUnlock } from './operations/board_unlock';
import { boardUpdate } from './operations/board_update';
import { chanLock } from './operations/chan_lock';
import { chanUnlock } from './operations/chan_unlock';
import { postBan } from './operations/post_ban';
import { postCreate } from './operations/post_create';
import { postRemove } from './operations/post_remove';
import { postReport } from './operations/post_report';
import { threadLock } from './operations/thread_lock';
import { threadPin } from './operations/thread_pin';
import { threadRemove } from './operations/thread_remove';
import { threadUnlock } from './operations/thread_unlock';
import { userBan } from './operations/user_ban';
import { userUnban } from './operations/user_unban';

import { userLoadOrCreate } from './internal/user';
import { eventId } from './id';
import { userIsBanned } from './internal/user_ban';
import { isChanLocked } from './internal/chan_status';

type Data = TypedMap<string, JSONValue>

export function handleMessage(message: Message): void {
  let success = false
  let evtId = eventId(message)
  let chanId = message.transaction.to.toHexString()

  let chanStatus = ChanStatus.load(chanId)
  if (chanStatus == null) {
    chanStatus = new ChanStatus(chanId)
    chanStatus.isLocked = false
    chanStatus.save()
  }

  log.debug("Handling message: {}", [evtId])

  let jsonMessage = message.params.jsonMessage

  let jsonDict = parseJsonMessage(message, ByteArray.fromUTF8(jsonMessage) as Bytes)
  if (jsonDict != null) {
    success = processMessagePayload(message, jsonDict as TypedMap<string, JSONValue>)
  }

  if (success == true) {
    log.debug("Message processed successfully: {}", [evtId])
  } else {
    log.warning("Message failed: {}", [evtId])
  }

  log.debug("Handled message: {}", [evtId])
}

export function parseJsonMessage(message: Message, bytes: Bytes): TypedMap<string, JSONValue> | null {
  let evtId = eventId(message)
  let tryJsonPayloadData = json.try_fromBytes(bytes);
  if (!tryJsonPayloadData.isOk) {
    log.error("Could not parse message, skipping {}", [evtId])

    return null
  }

  log.debug("Json message parsed successfully: {}", [evtId]);

  return tryJsonPayloadData.value.toObject();
}

function processMessagePayload(message: Message, payload: TypedMap<string, JSONValue>): boolean {
  let user = userLoadOrCreate(message)
  let evtId = eventId(message)

  // Always good to have but not needed now
  // let version = payload.get('v');
  // let namespace = payload.get('ns');
  let operation = ensureString(payload.get('op'));

  if (operation != null) {
    log.debug("Received operation: {}", [operation])

    let data = ensureObject(payload.get('data'));
    if (data != null) {
      // Admin
      if (operation == "chan:unlock") {
        return chanUnlock(message, user)
      } else if (operation == "chan:lock") {
        return chanLock(message, user)
      } else if (operation == "admin:claim") {
        return adminClaim(message, user)
      } else if (operation == "admin:grant") {
        return adminGrant(message, user, data as Data)
      } else if (operation == "admin:revoke") {
        return adminRevoke(message, user, data as Data)
      } else

      // Checks
      if (isChanLocked(message)) {
        log.warning("Chan locked, skipping {}", [evtId])

        return false
      }
      if (userIsBanned(message, user.id)) {
        log.info("User {} is banned, skipping {}", [user.id, evtId])

        return false
      }

      // AI
      if (operation == "board:create") {
        return boardCreate(message, user, data as Data)
      } else if (operation == "board:lock") {
        return boardLock(message, user, data as Data)
      } else if (operation == "board:remove") {
        return boardRemove(message, user, data as Data)
      } else if (operation == "board:update") {
        return boardUpdate(message, user, data as Data)
      } else if (operation == "board:unlock") {
        return boardUnlock(message, user, data as Data)
      } else if (operation == "post:ban") {
        return postBan(message, user, data as Data)
      } else if (operation == "user:ban") {
        return userBan(message, user, data as Data)
      } else if (operation == "user:unban") {
        return userUnban(message, user, data as Data)
      } else if (operation == "thread:pin") {
        return threadPin(message, user, data as Data)
      } else if (operation == "thread:lock") {
        return threadLock(message, user, data as Data)
      } else if (operation == "thread:unlock") {
        return threadUnlock(message, user, data as Data)
      } else if (operation == "post:create") {
        return postCreate(message, user, data as Data)
      } else if (operation == "post:remove") {
        return postRemove(message, user, data as Data)
      } else if (operation == "post:report") {
        return postReport(message, user, data as Data)
      } else if (operation == "thread:remove") {
        return threadRemove(message, user, data as Data)
      } else {
        log.warning("Invalid operation {}, skipping: {}", [operation, evtId]);
      }
    } else {
      log.warning("Invalid data, skipping {}", [evtId])
    }
  } else {
    log.warning("Invalid format, skipping: {}", [evtId]);
  }

  return false
}