import { providers } from 'ethers'
import { Socket } from 'zeromq'

import { Collector } from '../lib/types/collectors'
import logger from '../lib/logger'
import error from '../lib/errors'

export type NewBlock = {
    type: 'NewBlock'
    hash: string
    number: number
}

export type NewBlockCollectorProps = {
    client: providers.WebSocketProvider
}

export type NewBlockCollector = (params: NewBlockCollectorProps) => NewBlock

export const useBlockCollector: Collector<NewBlockCollector> = ({ client }) => {
    const getEventStream = async (publisher: Socket) => {
        client.on('block', async (blockNumber: number) => {
            try {
                const block = await client.getBlock(blockNumber)

                if (!block?.hash) {
                    logger.warn(error.Collector.NewBlock.FailedRetrievingHash(blockNumber))

                    return
                }

                const newBlock = {
                    type: 'NewBlock',
                    hash: block.hash,
                    number: block.number,
                }

                publisher.send(['NewBlock', JSON.stringify(newBlock)])

                logger.success(error.Collector.NewBlock.SuccessPublishingBlock(newBlock))
            } catch (err) {
                logger.error(error.Collector.NewBlock.FailedPublishingBlock(err))
            }
        })
    }

    return { getEventStream }
}
