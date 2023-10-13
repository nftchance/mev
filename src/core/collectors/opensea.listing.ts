import {
	ItemListedEvent,
	ItemListedEventPayload,
	OpenSeaStreamClient
} from '@opensea/stream-js'
import { EventEmitter } from 'node:events'
import { OpenSeaSDK } from 'opensea-js'

import { Collector } from '@/core/collector'
import errors from '@/lib/errors'

const key = 'OpenseaListing' as const

export class OpenseaListingCollector extends Collector<
	typeof key,
	{
		listing: ItemListedEventPayload
	}
> {
	constructor(
		public readonly openseaClient: OpenSeaSDK,
		public readonly openseaStreamClient: OpenSeaStreamClient
	) {
		super(key, errors.Collector.OpenseaListing)
	}

	getCollectionStream = async (stream: EventEmitter) => {
		this.openseaStreamClient.onItemListed('*', (event: ItemListedEvent) => {
			this.emit(stream, {
				listing: event.payload
			})
		})
	}
}
