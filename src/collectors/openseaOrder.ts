import { ItemListedEvent, OpenSeaStreamClient } from '@opensea/stream-js'

import { OpenseaOrder, OpenseaOrderCollector } from '../types/collectors'

import { useStream } from '../hooks'

// const openseaApiKey = '75ba8911aefa44b28cef77ba848e27d5'

export const useOpenseaOrder: OpenseaOrderCollector = ({ apiKey }) => {
    const { emitter, iterator } = useStream()

    const getEventStream = async () => {
        // Get OpenSea stream client to listen to outgoing events
        const client = new OpenSeaStreamClient({ token: apiKey })

        // Map the ItemListed event payload to the OpenseaOrder type
        const itemListed = async (event: ItemListedEvent) => {
            const order: OpenseaOrder = {
                type: 'OpenseaOrder',
                listing: event.payload,
            }

            emitter.emit('NewOrder', order)
        }

        client.onItemListed('*', itemListed)

        return iterator<OpenseaOrder>('NewOrder')
    }

    return { getEventStream }
}
