import { ItemListedEventPayload } from '@opensea/stream-js'
import { WebSocketProvider } from 'ethers'

export type CollectorStream<T> = {
    [Symbol.asyncIterator]: () => AsyncIterator<T>
}

export type Collector<T, P> = (props: P) => {
    getEventStream: () => Promise<CollectorStream<T>>
}

// Block Collector
export type NewBlock = {
    type: 'NewBlock'
    hash: string
    number: number
}

export type BlockCollectorProps = {
    provider: WebSocketProvider
}

export type BlockCollector = Collector<NewBlock, BlockCollectorProps>

// Opensea Order Collector
export type OpenseaOrder = {
    type: 'OpenseaOrder'
    listing: ItemListedEventPayload
}

export type OpenseaOrderCollectorProps = {
    apiKey: string
}

export type OpenseaOrderCollector = Collector<
    OpenseaOrder,
    OpenseaOrderCollectorProps
>
