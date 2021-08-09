import { BigInt, ByteArray, Bytes, ipfs, json, JSONValue, JSONValueKind, log, TypedMap, Value } from '@graphprotocol/graph-ts';
import { Message } from '../generated/Relay/Relay'
import { Board, Post, User, Thread, Image, ChanStatus } from '../generated/schema'
import { ensureNumber, ensureObject, ensureString } from './ensure'
import { boardCreate } from './operations/board_create';
import { boardLock } from './operations/board_lock';
import { boardUnlock } from './operations/board_unlock';
import { boardRemove } from './operations/board_remove';
import { postCreate } from './operations/post_create';
import { postRemove } from './operations/post_remove';
import { threadLock } from './operations/thread_lock';
import { threadUnlock } from './operations/thread_unlock';
import { threadRemove } from './operations/thread_remove';
import { eventId } from './utils';
import { dchanLock } from './operations/dchan_lock';
import { dchanUnlock } from './operations/dchan_unlock';
import { isDchanLocked } from './jannies';
import { threadPin } from './operations/thread_pin';

type Data = TypedMap<string, JSONValue>

export function handleMessage(message: Message): void {
  let evtId = eventId(message)
  let chanId = message.transaction.to.toHexString()

  let chanStatus = ChanStatus.load(chanId)
  if(chanStatus == null) {
    chanStatus = new ChanStatus(chanId)
    chanStatus.isLocked = false
    chanStatus.save()
  }

  log.debug("Handle message: {}", [evtId])

  let jsonMessage = message.params.jsonMessage

  let tryJsonPayloadData = json.try_fromBytes(ByteArray.fromUTF8(jsonMessage) as Bytes);
  if (tryJsonPayloadData.isOk) {
    log.info("Json message parsed successfully: {}", [evtId]);

    let jsonDict = tryJsonPayloadData.value.toObject();

    let success = processMessagePayload(message, jsonDict)
    
    if(success == true) {
      log.info("Message processed successfully: {}", [evtId])
    } else {
      log.warning("Message failed: {}", [evtId])
    }
  } else {
    log.error("Could not parse message, skipping {}", [evtId])
  }

  log.info("Handled message: {}", [evtId])
}

function processMessagePayload(message: Message, payload: TypedMap<string, JSONValue>): boolean {
  let evtId = eventId(message)

  // Always good to have but not needed now
  // let version = payload.get('v');
  // let namespace = payload.get('ns');
  let operation = ensureString(payload.get('op'));

  if (operation != null) {
    log.info("Received operation: {}", [operation])

    let data = ensureObject(payload.get('data'));
    if (data != null) {
      
      if(operation == "dchan:unlock") {
        return dchanUnlock(message)
      } else if(operation == "dchan:lock") {
        return dchanLock(message)
      }
    
      if(isDchanLocked(message)) {
          log.warning("Dchan locked, skipping {}", [evtId])
  
          return false
      }

      if(operation == "board:create") {
        return boardCreate(message, data as Data)
      } else if(operation == "board:remove") {
        return boardRemove(message, data as Data)
      } else if(operation == "board:lock") {
        return boardLock(message, data as Data)
      } else if(operation == "board:unlock") {
        return boardUnlock(message, data as Data)
      } else if(operation == "post:create") {
        return postCreate(message, data as Data)
      } else if(operation == "post:remove") {
        return postRemove(message, data as Data)
      } else if(operation == "thread:pin") {
        return threadPin(message, data as Data)
      } else if(operation == "thread:lock") {
        return threadLock(message, data as Data)
      } else if(operation == "thread:unlock") {
        return threadUnlock(message, data as Data)
      } else if(operation == "thread:remove") {
        return threadRemove(message, data as Data)
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