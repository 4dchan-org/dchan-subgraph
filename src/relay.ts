import { ByteArray, Bytes, json, JSONValue, log, TypedMap } from '@graphprotocol/graph-ts'
import { ensureObject, ensureString } from './ensure'

import { adminClaim } from './operations/admin_claim'
import { adminGrant } from './operations/admin_grant'
import { adminRevoke } from './operations/admin_revoke'
import { boardCreate } from './operations/board_create'
import { boardLock } from './operations/board_lock'
import { boardRemove } from './operations/board_remove'
import { boardUnlock } from './operations/board_unlock'
import { boardUpdate } from './operations/board_update'
import { chanLock } from './operations/chan_lock'
import { chanUnlock } from './operations/chan_unlock'
import { jannyGrant } from './operations/janny_grant'
import { jannyRevoke } from './operations/janny_revoke'
import { postBan } from './operations/post_ban'
import { postCreate } from './operations/post_create'
import { postRemove } from './operations/post_remove'
import { postReport } from './operations/post_report'
import { threadLock } from './operations/thread_lock'
import { threadPin } from './operations/thread_pin'
import { threadUnpin } from './operations/thread_unpin'
import { threadUnlock } from './operations/thread_unlock'
import { userBan } from './operations/user_ban'
import { userUnban } from './operations/user_unban'

import { locateUserFromMessage } from './internal/user'
import { eventId } from './id'
import { blockId } from './internal/block'
import { userIsBanned } from './internal/user_ban'
import { isChanLocked } from './internal/chan_status'
import { boardReport } from './operations/board_report'
import { clientPublish } from './operations/client_publish'

import { Message } from '../generated/Relay/Relay'
import { Block } from '../generated/schema'

type Data = TypedMap<string, JSONValue>

export function handleMessage(message: Message): void {
  let success = false
  let evtId = eventId(message)

  log.debug("Handling message: {}", [evtId])

  let jsonMessage = message.params.jsonMessage

  log.debug("Parsing jsonMessage: {}", [jsonMessage])

  let jsonDict = parseJsonMessage(message, jsonMessage)
  if (jsonDict != null) {
    success = processMessagePayload(message, jsonDict as TypedMap<string, JSONValue>)
  }

  if (success == true) {
    log.debug("Message processed successfully: {}", [evtId])

    let block = new Block(blockId(message))
    block.timestamp = message.block.timestamp
    block.number = message.block.number
    block.save()
  } else {
    log.warning("Message failed: {}", [evtId])
  }

  log.debug("Handled message: {}", [evtId])
}

export function parseJsonMessage(message: Message, jsonMessage: string): TypedMap<string, JSONValue> | null {
  let evtId = eventId(message)
  let tryJsonPayloadData = json.try_fromString(jsonMessage)
  if (!tryJsonPayloadData.isOk) {
    log.error("Could not parse message, skipping {}", [evtId])

    return null
  }

  log.debug("Json message parsed successfully: {}", [evtId])

  return tryJsonPayloadData.value.toObject()
}

function processMessagePayload(message: Message, payload: TypedMap<string, JSONValue>): boolean {
  let user = locateUserFromMessage(message)
  let evtId = eventId(message)

  // Always good to have but not needed now
  // let version = payload.get('v')
  // let namespace = payload.get('ns')
  let maybeOperation = ensureString(payload.get('op'))
  if(!maybeOperation) {
    log.warning("Invalid format, skipping: {}", [evtId])

    return false
  }
  
  let operation = maybeOperation as string
  log.debug("Received operation: {}", [operation])

  let maybeData = ensureObject(payload.get('data'))
  if (!maybeData) {
    log.warning("Invalid data, skipping {}", [evtId])

    return false
  }

  let data = maybeData as Data

  // IPFS client
  if (operation == "client:publish") {
    return clientPublish(message, user, data)
  }

  // Admin
  if (operation == "chan:unlock") {
    return chanUnlock(message, user)
  } else if (operation == "chan:lock") {
    return chanLock(message, user)
  } else if (operation == "admin:claim") {
    return adminClaim(message, user)
  } else if (operation == "admin:grant") {
    return adminGrant(message, user, data)
  } else if (operation == "admin:revoke") {
    return adminRevoke(message, user, data)
  }

  // Checks
  if (isChanLocked(message)) {
    log.warning("Chan locked, skipping {}", [evtId])

    return false
  }
  if (userIsBanned(message, user.id)) {
    log.info("User {} is banned, skipping {}", [user.id, evtId])

    return false
  }

  // Operation switch
  if (operation == "board:create") {
    return boardCreate(message, user, data)
  } else if (operation == "board:lock") {
    return boardLock(message, user, data)
  } else if (operation == "board:remove") {
    return boardRemove(message, user, data)
  } else if (operation == "board:report") {
    return boardReport(message, user, data)
  } else if (operation == "board:update") {
    return boardUpdate(message, user, data)
  } else if (operation == "board:unlock") {
    return boardUnlock(message, user, data)
  } else if (operation == "janny:grant") {
    return jannyGrant(message, user, data)
  } else if (operation == "janny:revoke") {
    return jannyRevoke(message, user, data)
  } else if (operation == "post:ban") {
    return postBan(message, user, data)
  } else if (operation == "user:ban") {
    return userBan(message, user, data)
  } else if (operation == "user:unban") {
    return userUnban(message, user, data)
  } else if (operation == "thread:pin") {
    return threadPin(message, user, data)
  } else if (operation == "thread:unpin") {
    return threadUnpin(message, user, data)
  } else if (operation == "thread:lock") {
    return threadLock(message, user, data)
  } else if (operation == "thread:unlock") {
    return threadUnlock(message, user, data)
  } else if (operation == "post:create") {
    return postCreate(message, user, data)
  } else if (operation == "post:remove") {
    return postRemove(message, user, data)
  } else if (operation == "post:report") {
    return postReport(message, user, data)
  } else {
    log.warning("Invalid operation {}, skipping: {}", [operation, evtId])
  }

  return false
}