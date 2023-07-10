import { ItemListedEvent } from '@opensea/stream-js'

import { Collector, OpenseaOrder } from '../types/collectors'

export const useOpenseaOrder: Collector<OpenseaOrder> = ({
    openseaStreamClient,
}) => {
    async function* getEventStream(): AsyncGenerator<ReturnType<OpenseaOrder>> {
        while (true) {
            const event = await new Promise<ItemListedEvent>((resolve) => {
                openseaStreamClient.onItemListed(
                    '*',
                    (event: ItemListedEvent) => resolve(event),
                )
            })

            const order: ReturnType<OpenseaOrder> = {
                type: 'OpenseaOrder',
                listing: event.payload,
            }

            yield order
        }
    }

    return { getEventStream }
}
