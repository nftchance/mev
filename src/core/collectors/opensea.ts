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
	public static key = key

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

// ! TODO: There is probably a better way to do this, but I
//         wanted to maintain the verbosity of unique
//         collectors rather a single 'Opensea' collector. If
//         you can think of a better way to implement this
//         while maintaing the verbosity feel free to open a PR
//         with an improvement.

export class OpenseaItemMetadataCollector extends OpenseaCollector<'onItemMetadataUpdated'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemMetadataUpdated', openseaStreamClient)
	}
}

export type OpenseaItemMetadataCollection = Parameters<
	OpenseaItemMetadataCollector['emit']
>[1]

export class OpenseaItemCancelledCollector extends OpenseaCollector<'onItemCancelled'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemCancelled', openseaStreamClient)
	}
}

export type OpenseaItemCancelledCollection = Parameters<
	OpenseaItemCancelledCollector['emit']
>[1]

export class OpenseaListingCollector extends OpenseaCollector<'onItemListed'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemListed', openseaStreamClient)
	}
}

export type OpenseaListingCollection = Parameters<
	OpenseaListingCollector['emit']
>[1]

export class OpenseaItemSoldCollector extends OpenseaCollector<'onItemSold'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemSold', openseaStreamClient)
	}
}

export type OpenseaItemSoldCollection = Parameters<
	OpenseaItemSoldCollector['emit']
>[1]

export class OpenseaItemTransferredCollector extends OpenseaCollector<'onItemTransferred'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemTransferred', openseaStreamClient)
	}
}

export type OpenseaItemTransferredCollection = Parameters<
	OpenseaItemTransferredCollector['emit']
>[1]

export class OpenseaItemOfferCollector extends OpenseaCollector<'onItemReceivedOffer'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemReceivedOffer', openseaStreamClient)
	}
}

export type OpenseaItemOfferCollection = Parameters<
	OpenseaItemOfferCollector['emit']
>[1]

export class OpenseaItemBidCollector extends OpenseaCollector<'onItemReceivedBid'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemReceivedBid', openseaStreamClient)
	}
}

export type OpenseaItemBidCollection = Parameters<
	OpenseaItemBidCollector['emit']
>[1]

export class OpenseaCollectionOfferCollector extends OpenseaCollector<'onCollectionOffer'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onCollectionOffer', openseaStreamClient)
	}
}

export type OpenseaCollectionOfferCollection = Parameters<
	OpenseaCollectionOfferCollector['emit']
>[1]

export class OpenseaTraitOfferCollector extends OpenseaCollector<'onTraitOffer'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onTraitOffer', openseaStreamClient)
	}
}

export type OpenseaTraitOfferCollection = Parameters<
	OpenseaTraitOfferCollector['emit']
>[1]

export class OpenseaOrderInvalidateCollector extends OpenseaCollector<'onOrderInvalidate'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onOrderInvalidate', openseaStreamClient)
	}
}

export type OpenseaOrderInvalidateCollection = Parameters<
	OpenseaOrderInvalidateCollector['emit']
>[1]

export class OpenseaOrderRevalidateCollector extends OpenseaCollector<'onOrderRevalidate'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onOrderRevalidate', openseaStreamClient)
	}
}

export type OpenseaOrderRevalidateCollection = Parameters<
	OpenseaOrderRevalidateCollector['emit']
>[1]
