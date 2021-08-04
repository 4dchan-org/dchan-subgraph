import { BigInt, Bytes, ipfs, json, JSONValue, JSONValueKind, log, TypedMap } from '@graphprotocol/graph-ts';
import { Message } from '../generated/Relay/Relay'
import { Board, Post, User, Thread, Image } from '../generated/schema'
import { ensureNumber, ensureObject, ensureString } from './ensure'
import { boardCreate } from './operations/board_create';
import { postCreate } from './operations/post_create';
import { postDelete } from './operations/post_delete';
import { threadLock } from './operations/thread_lock';

type Data = TypedMap<string, JSONValue>

export function handleMessage(message: Message): void {
  let txId = message.transaction.hash.toHexString()

  log.debug("Handle message: {}", [txId])

  let ipfsHash = message.params.ipfs_hash

  log.info("Retrieving IPFS message: {}", [ipfsHash]);

  let ipfsMessage = ipfs.cat(ipfsHash)

  if (ipfsMessage != null) {
    log.info("Retrieved IPFS message", [ipfsHash]);

    let tryIpfsPayloadData = json.try_fromBytes(ipfsMessage as Bytes);
    if (tryIpfsPayloadData.isOk) {
      log.info("IPFS message parsed successfully: {}", [txId]);

      let jsonDict = tryIpfsPayloadData.value.toObject();

      let success = processMessagePayload(message, jsonDict)
      
      if(success == true) {
        log.info("Message processed successfully: {}", [txId])
      } else {
        log.warning("Message failed: {}", [txId])
      }
    } else {
      log.error("Could not parse message, skipping", [])
    }
  } else {
    log.error("Could not retrieve message from IPFS, skipping: {}", [txId]);
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
      } else if(operation == "post:create") {
        return postCreate(message, data as Data)
      } else if(operation == "post:delete") {
        return postDelete(message, data as Data)
      } else if(operation == "thread:lock") {
        return threadLock(message, data as Data)
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