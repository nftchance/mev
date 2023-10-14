import { BlockCollector } from '@/core/collectors/block'
import { LogExecutor } from '@/core/executors/log'
import { Strategy } from '@/core/strategy'
import { logger } from '@/lib/logger'

export class BlockLog<
	TCollector extends BlockCollector,
	TExecutor extends LogExecutor
> extends Strategy<TCollector, TExecutor> {
	constructor() {
		super('BlockLog')
	}

	// ! A new collection will arrive from the collector every time
	//   a new block is mined. Because this is a basic BlockLog, we
	//   will always pass on a message to the executor.
	processCollection = async (
		key: TCollector['key'],
		collection: Parameters<TCollector['emit']>[1]
	) => {
		switch (key) {
			case 'NewBlock':
				return { message: `Block Number: ${collection.number}` }
		}

		logger.error(`[${this.key}]: Invalid key [${key}]`)
	}
}
