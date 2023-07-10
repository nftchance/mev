import { Collector, NewBlock } from '../types/collectors'

import { Socket } from 'zeromq'

export const useBlockCollector: Collector<NewBlock> = ({ client }) => {
    const getEventStream = async (publisher: Socket) => {
        // Tagged with `await` because we need to wait for the client to be ready.
        await client.on('block', async (blockNumber: number) => {
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

                // Convert to string because zeromq only accepts strings.
                publisher.send(['NewBlock', JSON.stringify(newBlock)])
            } catch (err) {
                console.error('Error sending block', err)
            }
        })
    }

    return { getEventStream }
}
