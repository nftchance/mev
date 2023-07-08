import { ItemListedEvent } from '@opensea/stream-js'

import { Collector, CollectorStream, OpenseaOrder } from '../types/collectors'

import { useStream } from '../hooks'

export const useOpenseaOrder: Collector<OpenseaOrder> = ({ openseaClient }) => {
    const { emitter, iterator } = useStream()

    const getEventStream = async (): Promise<
        CollectorStream<ReturnType<OpenseaOrder>>
    > => {
        openseaClient.onItemListed('*', async (event: ItemListedEvent) => {
            const order: ReturnType<OpenseaOrder> = {
                type: 'OpenseaOrder',
                listing: event.payload,
            }

            emitter.emit('NewOrder', order)
        })

        return iterator<ReturnType<OpenseaOrder>>('OpenseaOrder')
    }

    return { getEventStream }
}
