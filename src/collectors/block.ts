import { Collector, NewBlock } from '../lib/types/collectors'
import { EventEmitter } from 'stream'

export const useBlockCollector: Collector<NewBlock> = ({ client }) => {
    const stream = new EventEmitter()

    const getEventStream = async () => {
        // Tagged with `await` because we need to wait for the client to be ready.
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

                // Convert to string because zeromq only accepts strings.
                const newBlockString = JSON.stringify(newBlock)

                // Emit the new block event.
                stream.emit('message', newBlockString)
            } catch (err) {
                console.error('Error sending block', err)
            }
        })
    }

    return { stream, getEventStream }
}
