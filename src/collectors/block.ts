import { Socket } from 'zeromq'
import { Collector, NewBlock } from '../lib/types/collectors'

export const useBlockCollector: Collector<NewBlock> = ({ client }) => {
    const getEventStream = async (publisher: Socket) => {
        client.on('block', async (blockNumber: number) => {
            try {
                // Get the details of the iterated block
                const block = await client.getBlock(blockNumber)

                // If we can't get the block, then we can't do anything with it.
                if (!block?.hash) return

                const newBlock: ReturnType<NewBlock> = {
                    type: 'NewBlock',
                    hash: block.hash,
                    number: block.number,
                }

                // Emit the new block event.
                publisher.send(['NewBlock', JSON.stringify(newBlock)])
            } catch (err) {
                console.error('Error sending block', err)
            }
        })
    }

    return { getEventStream }
}
