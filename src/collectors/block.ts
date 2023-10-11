import { providers } from 'ethers'
import { EventEmitter } from 'stream'

import { Collector } from '../lib/types/collectors'
import logger from '../lib/logger'
import error from '../lib/errors'

const key = 'NewBlock' as const 

export type NewBlock = {
    type: typeof key
    hash: string
    number: number
}

export type NewBlockCollectorProps = {
    client: providers.WebSocketProvider
}

export type NewBlockCollector = (params: NewBlockCollectorProps) => NewBlock


export const useBlockCollector: Collector<NewBlockCollector> = ({ client }) => {
    const getEventStream = async (stream: EventEmitter) => {
        client.on('block', async (blockNumber: number) => {
            try {
                const block = await client.getBlock(blockNumber)

                if (!block?.hash) {
                    logger.warn(error.Collector.NewBlock.FailedRetrievingHash(blockNumber))

                    return
                }

                const newBlock = {
                    type: key,
                    hash: block.hash,
                    number: block.number,
                }

                stream.emit('Collection', [key, newBlock])

                logger.success(error.Collector.NewBlock.SuccessPublishingBlock(newBlock))
            } catch (err) {
                logger.error(error.Collector.NewBlock.FailedPublishingBlock(err))
            }
        })
    }

    return { key, getEventStream }
}
