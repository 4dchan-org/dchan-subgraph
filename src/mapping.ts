import { BigInt, ByteArray, Bytes, ipfs, json, JSONValue, JSONValueKind, log, TypedMap, Value } from '@graphprotocol/graph-ts';
import { Message } from '../generated/Relay/Relay'
import { Board, Post, User, Thread, Image } from '../generated/schema'
import { ensureNumber, ensureObject, ensureString } from './ensure'
import { boardCreate } from './operations/board_create';
import { boardRemove } from './operations/board_remove';
import { postCreate } from './operations/post_create';
import { postRemove } from './operations/post_remove';
import { threadLock } from './operations/thread_lock';
import { threadRemove } from './operations/thread_remove';

type Data = TypedMap<string, JSONValue>

export function handleMessage(message: Message): void {
  let txId = message.transaction.hash.toHexString()

  log.debug("Handle message: {}", [txId])

  let jsonMessage = message.params.jsonMessage

  let tryJsonPayloadData = json.try_fromBytes(ByteArray.fromUTF8(jsonMessage) as Bytes);
  if (tryJsonPayloadData.isOk) {
    log.info("Json message parsed successfully: {}", [txId]);

    let jsonDict = tryJsonPayloadData.value.toObject();

    let success = processMessagePayload(message, jsonDict)
    
    if(success == true) {
      log.info("Message processed successfully: {}", [txId])
    } else {
      log.warning("Message failed: {}", [txId])
    }
  } else {
    log.error("Could not parse message, skipping", [])
  }

  log.info("Handled message: {}", [txId])
}

function processMessagePayload(message: Message, payload: TypedMap<string, JSONValue>): boolean {
  let txId = message.transaction.hash.toHexString()
  // Always good to have but not needed now
  // let version = payload.get('v');
  // let namespace = payload.get('ns');
  let operation = ensureString(payload.get('op'));

  if (operation != null) {
    log.info("Received operation: {}", [operation])

    let data = ensureObject(payload.get('data'));
    if (data != null) {
      if(operation == "board:create") {
        return boardCreate(message, data as Data)
      } else if(operation == "board:remove") {
        return boardRemove(message, data as Data)
      } else if(operation == "post:create") {
        return postCreate(message, data as Data)
      } else if(operation == "post:remove") {
        return postRemove(message, data as Data)
      } else if(operation == "thread:lock") {
        return threadLock(message, data as Data)
      } else if(operation == "thread:remove") {
        return threadRemove(message, data as Data)
      } else {
        log.warning("Invalid operation {}, skipping: {}", [operation, txId]);
      }
    } else {
      log.warning("Invalid data, skipping", [])
    }
  } else {
    log.warning("Invalid format, skipping: {}", [txId]);
  }

  return false
}