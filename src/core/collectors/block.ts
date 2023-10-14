import { providers } from 'ethers'
import { EventEmitter } from 'node:events'

import { Collector } from '@/core/collector'
import errors from '@/lib/errors'

const key = 'NewBlock' as const

export class BlockCollector extends Collector<
	typeof key,
	{
		hash: string
		number: number
	}
> {
	constructor(public readonly client: providers.WebSocketProvider) {
		super(key, errors.Collector.NewBlock)
	}

	getCollectionStream = async (stream: EventEmitter) => {
		this.client.on('block', async (blockNumber: number) => {
			try {
				const block = await this.client.getBlock(blockNumber)

				if (!block?.hash) {
					this.logger.warn(
						this.errors.FailedRetrievingHash(blockNumber)
					)
				}

				this.emit(stream, {
					hash: block.hash,
					number: block.number
				})
			} catch (err) {
				this.logger.error('Failed retrieving block.')
			}
		})
	}
}
