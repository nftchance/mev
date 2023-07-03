import { WebSocketProvider } from 'ethers'

export type CollectorStream<T> = {
    [Symbol.asyncIterator]: () => AsyncIterator<T>
}

export type Collector<T, P> = (props: P) => {
    getEventStream: () => Promise<CollectorStream<T>>
}

export type NewBlock = {
    type: 'NewBlock'
    hash: string
    number: number
}

export type OpenseaOrder = {
    type: 'OpenseaOrder'
    listing: string
}

export type BlockCollectorProps = {
    provider: WebSocketProvider
}

export type BlockCollector = Collector<NewBlock, BlockCollectorProps>
