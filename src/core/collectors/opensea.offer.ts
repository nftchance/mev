import { OpenseaCollector } from './opensea'
import { OpenSeaStreamClient } from '@opensea/stream-js'

export class OpenseaItemOfferCollector extends OpenseaCollector<'onItemReceivedOffer'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemReceivedOffer', openseaStreamClient)
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
