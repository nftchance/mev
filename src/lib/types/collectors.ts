import { ExtractParams, UnionToIntersection } from './utils'
import { ItemListedEventPayload, OpenSeaStreamClient } from '@opensea/stream-js'
import { providers } from 'ethers'
import { OpenSeaSDK } from 'opensea-js'

import { EventEmitter } from 'events'

// Parameters of the collectors as objects.
export type Event = {
    type: string
}

// Events that could fire from collectors.
export type NewBlock = (params: {
    client: providers.WebSocketProvider
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
    getEventStream: (stream: EventEmitter) => Promise<ReturnType<TEvent>> | Promise<void>
}
