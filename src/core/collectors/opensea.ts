import { OpenSeaStreamClient } from '@opensea/stream-js'
import { EventEmitter } from 'node:events'

import { Collector } from '@/core/collector'

const key = 'Opensea' as const

const collectorKeys = [
	'onItemListed',
	'onCollectionOffer',
	'onItemReceivedOffer',
	'onTraitOffer'
] as const

export class OpenseaCollector<
	TKey extends (typeof collectorKeys)[number]
> extends Collector<
	`${typeof key}${TKey}`,
	// ! Recover the callback parameter type from the OpenSeaStreamClient.
	Parameters<Parameters<OpenSeaStreamClient[TKey]>[1]>[0]['payload']
> {
	constructor(
		public readonly collectorKey: TKey,
		public readonly openseaStreamClient: OpenSeaStreamClient
	) {
		super(`${key}${collectorKey}`)
	}

	getCollectionStream = async (stream: EventEmitter) => {
		this.openseaStreamClient[this.collectorKey]('*', event => {
			this.emit(stream, event.payload)
		})
	}
}
