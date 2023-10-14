import { OpenseaCollector } from './opensea'
import { OpenSeaStreamClient } from '@opensea/stream-js'

export class OpenseaListingCollector extends OpenseaCollector<'onItemListed'> {
	constructor(public readonly openseaStreamClient: OpenSeaStreamClient) {
		super('onItemListed', openseaStreamClient)
	}
}
