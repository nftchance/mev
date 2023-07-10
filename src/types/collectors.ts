import { ItemListedEventPayload, OpenSeaStreamClient } from '@opensea/stream-js'
import { WebSocketProvider } from 'ethers'
import { OpenSeaSDK } from 'opensea-js'
import { Socket } from 'zeromq'

// Iterate over the parameters of the event and action and
// create a union of all of them.
type ExtractParams<TEvent extends (...args: any) => any> =
    Parameters<TEvent>[number]

type UnionToIntersection<T> = (
    T extends any
        ? (args: T) => any
        : never
) extends (args: infer U) => any
    ? U
    : never

// Parameters of the collectors as objects.
type Event = {
    type: string
}

// Events that could fire from collectors.
export type NewBlock = (params: {
    client: WebSocketProvider
}) => Event & {
    type: 'NewBlock'
    hash: string
    number: number
}

export type OpenseaOrder = (params: {
    openseaClient: OpenSeaSDK
    openseaStreamClient: OpenSeaStreamClient
}) => Event & {
    type: 'OpenseaOrder'
    listing: ItemListedEventPayload
}

// Create a collector that has a generic type of TEvent
// and takes a generic type of TParams.
export type Collector<
    TEvent extends (...args: any) => any = () => {},
    TParams = {},
> = (
    // Inherit the parameters from the event and action.
    params: UnionToIntersection<ExtractParams<TEvent>> & TParams,
) => {
    getEventStream: (publisher: Socket) => Promise<void>
}
