import { ItemListedEventPayload } from '@opensea/stream-js'
import { WebSocketProvider } from 'ethers'

// Parameters of the collectors as objects.
// export type BlockCollectorParams =

// Events that could fire from collectors.
export type NewBlock = (params: {
    // TODO: need to update this to be a signed provider
    client: WebSocketProvider
}) => {
    type: 'NewBlock'
    hash: string
    number: number
}

export type OpenseaOrder = (params: {
    apiKey: string
}) => {
    type: 'OpenseaOrder'
    listing: ItemListedEventPayload
}

export type CollectorStream<TEvent> = {
    [Symbol.asyncIterator]: () => AsyncIterator<TEvent>
}

// Create a collector that has a generic type of TEvent
// and takes a generic type of TParams.
export type Collector<TEvent = {}> = <TParams = {}>(
    params: TParams,
) => {
    // This is a promise that resolves to an async iterator
    // meaning that it can be used in a for await loop like:
    // for await (const event of collector.getEventStream()) {
    //     // do something with event
    // }
    // and it will yield events as they come in.
    getEventStream: () => Promise<CollectorStream<TEvent>>
}
