import { Collector, CollectorStream, NewBlock } from '../types/collectors'

import { useStream } from '../hooks'

export const useBlockCollector: Collector<NewBlock> = ({ client }) => {
    const { emitter, iterator } = useStream()

    const getEventStream = async (): Promise<
        CollectorStream<ReturnType<NewBlock>>
    > => {
        client.on('block', async (blockNumber: number) => {
            const block = await client.getBlock(blockNumber)

            // If we can't get the block, then we can't do anything with it.
            if (!block?.hash) return

            const newBlock: ReturnType<NewBlock> = {
                type: 'NewBlock',
                hash: block.hash,
                number: block.number,
            }

            emitter.emit('newBlock', newBlock)
        })

        return iterator<ReturnType<NewBlock>>('newBlock')
    }

    return { getEventStream }
}
