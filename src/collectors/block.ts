import { BlockCollector, CollectorStream, NewBlock } from '../types/collectors'

import { useStream } from '../hooks'

export const useBlockCollector: BlockCollector = ({ provider }) => {
    const { emitter, iterator } = useStream()

    const getEventStream = async (): Promise<CollectorStream<NewBlock>> => {
        const listener = async (blockNumber: number) => {
            const block = await provider.getBlock(blockNumber)

            if (block?.hash) {
                const newBlock: NewBlock = {
                    type: 'NewBlock',
                    hash: block.hash,
                    number: block.number,
                }

                emitter.emit('newBlock', newBlock)
            }
        }

        provider.on('block', listener)

        return iterator<NewBlock>('newBlock')
    }

    return { getEventStream }
}
