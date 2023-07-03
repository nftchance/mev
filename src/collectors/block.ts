import { EventEmitter } from 'events'

import { BlockCollector, CollectorStream, NewBlock } from '../types/collectors'

export const useBlockCollector: BlockCollector = ({ provider }) => {
    const emitter = new EventEmitter()

    const getEventStream = async (): Promise<CollectorStream<NewBlock>> => {
        const listener = async (blockNumber: number) => {
            const block = await provider.getBlock(blockNumber)

            if (block?.hash) {
                const newBlock: NewBlock = {
                    hash: block.hash,
                    number: block.number,
                }

                emitter.emit('newBlock', newBlock)
            }
        }

        provider.on('block', listener)

        return {
            [Symbol.asyncIterator]: () => {
                return {
                    next: () =>
                        new Promise<IteratorResult<NewBlock>>((resolve) => {
                            emitter.once('newBlock', (block: NewBlock) => {
                                resolve({ value: block, done: false })
                            })
                        }),
                    [Symbol.asyncIterator]() {
                        return this
                    },
                }
            },
        }
    }

    return { getEventStream }
}
