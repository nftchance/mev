import { providers } from 'ethers'
import { EventEmitter } from 'node:events'

import { Collector } from '@/core/collector'

const key = 'NewBlock' as const

export class BlockCollector extends Collector<
	typeof key,
	{
		hash: string
		number: number
	}
> {
	constructor(public readonly client: providers.WebSocketProvider) {
		super(key)
	}

	getCollectionStream = async (stream: EventEmitter) => {
		this.client.on('block', async (blockNumber: number) => {
			try {
				const block = await this.client.getBlock(blockNumber)

				if (!block?.hash) {
					this.logger.warn(
						`[${this.key}]: Block [${blockNumber}] does not exist.`
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
