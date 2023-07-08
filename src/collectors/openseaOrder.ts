import { ItemListedEvent } from '@opensea/stream-js'

import { Collector, CollectorStream, OpenseaOrder } from '../types/collectors'

import { useStream } from '../hooks'

export const useOpenseaOrder: Collector<OpenseaOrder> = ({
    openseaStreamClient,
}) => {
    const { emitter, iterator } = useStream()

    const getEventStream = async (): Promise<
        CollectorStream<ReturnType<OpenseaOrder>>
    > => {
        openseaStreamClient.onItemListed(
            '*',
            async (event: ItemListedEvent) => {
                const order: ReturnType<OpenseaOrder> = {
                    type: 'OpenseaOrder',
                    listing: event.payload,
                }

                emitter.emit('OpenseaOrder', order)
            },
        )

        return iterator<ReturnType<OpenseaOrder>>('OpenseaOrder')
    }

    return { getEventStream }
}
