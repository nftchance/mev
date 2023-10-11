import { ItemListedEvent, ItemListedEventPayload, OpenSeaStreamClient } from '@opensea/stream-js'
import { OpenSeaSDK } from 'opensea-js'
import { EventEmitter } from 'stream'

import { Collector } from '../core/collector'

import errors from '../lib/errors'

const key = 'OpenseaOrder' as const

export class OpenseaOrder extends Collector<typeof key, {
    listing: ItemListedEventPayload
}> { 
    constructor(
        public readonly openseaClient: OpenSeaSDK,
        public readonly openseaStreamClient: OpenSeaStreamClient
    ) {
        super(key, errors.Collector.OpenseaOrder)
    }

    getEventstream = async (stream: EventEmitter) => {
        this.openseaStreamClient.onItemListed('*', (event: ItemListedEvent) => {
            this.emit(stream, {
                listing: event.payload,
            })
        })
    }
}