import { OpenSeaStreamClient } from '@opensea/stream-js'
import { EventEmitter } from 'node:events'

import { Collector } from '@/core/collector'

const key = 'Opensea' as const

const collectorKeys = [
	'onItemMetadataUpdated',
	'onItemCancelled',
	'onItemListed',
	'onItemSold',
	'onItemTransferred',
	'onItemReceivedOffer',
	'onItemReceivedBid',
	'onCollectionOffer',
	'onTraitOffer',
	'onOrderInvalidate',
	'onOrderRevalidate'
] as const

export class OpenseaCollector<
	TKey extends (typeof collectorKeys)[number]
> extends Collector<
	`${typeof key}${string}`,
	// ! Recover the callback parameter type from the OpenSeaStreamClient.
	Parameters<Parameters<OpenSeaStreamClient[TKey]>[1]>[0]['payload']
> {
	constructor(
		public readonly collectorKey: TKey,
		public readonly openseaStreamClient: OpenSeaStreamClient
	) {
		super(`${key}${collectorKey.replace('on', '')}`)
	}

	getCollectionStream = async (stream: EventEmitter) => {
		this.openseaStreamClient[this.collectorKey]('*', event => {
			this.emit(stream, event.payload)
		})
	}
}

// ! TODO: There is probably a better way to do this, but I wanted to maintain the verbosity of unique
//   collectors rather a single 'Opensea' collector. If you can think of a better way to
//   implement this while maintaing the verbosity feel free to open a PR with an improvement.

export class OpenseaItemMetadataCollector extends OpenseaCollector<'onItemMetadataUpdated'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemMetadataUpdated', openseaStreamClient)
	}
}

export class OpenseaItemCancelledCollector extends OpenseaCollector<'onItemCancelled'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemCancelled', openseaStreamClient)
	}
}

export class OpenseaListingCollector extends OpenseaCollector<'onItemListed'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemListed', openseaStreamClient)
	}
}

export class OpenseaItemSoldCollector extends OpenseaCollector<'onItemSold'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemSold', openseaStreamClient)
	}
}

export class OpenseaItemTransferredCollector extends OpenseaCollector<'onItemTransferred'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemTransferred', openseaStreamClient)
	}
}

export class OpenseaItemOfferCollector extends OpenseaCollector<'onItemReceivedOffer'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemReceivedOffer', openseaStreamClient)
	}
}

export class OpenseaItemBidCollector extends OpenseaCollector<'onItemReceivedBid'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemReceivedBid', openseaStreamClient)
	}
}

export class OpenseaCollectionOfferCollector extends OpenseaCollector<'onCollectionOffer'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onCollectionOffer', openseaStreamClient)
	}
}

export class OpenseaTraitOfferCollector extends OpenseaCollector<'onTraitOffer'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onTraitOffer', openseaStreamClient)
	}
}

export class OpenseaOrderInvalidateCollector extends OpenseaCollector<'onOrderInvalidate'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onOrderInvalidate', openseaStreamClient)
	}
}

export class OpenseaOrderRevalidateCollector extends OpenseaCollector<'onOrderRevalidate'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onOrderRevalidate', openseaStreamClient)
	}
}
