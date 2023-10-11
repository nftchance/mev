import { Collector, OpenseaOrder } from '../lib/types/collectors'

import { ItemListedEvent } from '@opensea/stream-js'
import { Socket } from 'zeromq'

export const useOpenseaOrder: Collector<OpenseaOrder> = ({
    openseaStreamClient,
}) => {
    const getEventStream = async (publisher: Socket) => {
        try {
            openseaStreamClient.onItemListed('*', (event: ItemListedEvent) => {
                const order: ReturnType<OpenseaOrder> = {
                    type: 'OpenseaOrder',
                    listing: event.payload,
                }

                publisher.send(['OpenseaOrder', JSON.stringify(order)])
            })
        } catch (err) {
            console.error('Error sending order', err)
        }
    }

    return { getEventStream }
}
