import { Message } from "../../generated/Relay/Relay"
import { Block } from "../../generated/schema"

export type BlockId = string

export function blockId(message: Message): BlockId {
    return message.block.hash.toHexString()
}

export function locateBlockFromMessage(message: Message): Block {
    let id = blockId(message)
    let block = Block.load(id)
    if(block == null) {
        block = new Block(id)
        block.number = message.block.number
        block.timestamp = message.block.timestamp
        block.save()
    }

    return block as Block
}