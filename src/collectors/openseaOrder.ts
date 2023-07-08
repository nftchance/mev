import { ItemListedEvent } from '@opensea/stream-js'

import { Collector, CollectorStream, OpenseaOrder } from '../types/collectors'

import { useStream } from '../hooks'

// const openseaApiKey = '75ba8911aefa44b28cef77ba848e27d5'

export const useOpenseaOrder: Collector<OpenseaOrder> = ({ openseaClient }) => {
    const { emitter, iterator } = useStream()

    const getEventStream = async (): Promise<
        CollectorStream<ReturnType<OpenseaOrder>>
    > => {
        // Get OpenSea stream client to listen to outgoing events
        // const client = new OpenSeaStreamClient({ token: apiKey })

        // Map the ItemListed event payload to the OpenseaOrder type
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
