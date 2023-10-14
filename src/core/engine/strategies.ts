import { BlockCollector } from '@/core/collectors/block'
import { LogExecutor } from '@/core/executors/log'
import { Strategy } from '@/core/strategy'
import { logger } from '@/lib/logger'

type TCollection = Parameters<BlockCollector['emit']>[1]
type TExecution = Parameters<LogExecutor['execute']>[0]

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
		collection: TCollection
	) => {
		switch (key) {
			case 'NewBlock':
				return { message: `Block Number: ${collection.number}` }
		}

		logger.error(`[${this.key}]: Invalid key [${key}]`)
	}
}

const tCollectionA: TCollection = { hash: '0x', number: 0 }
// @ts-expect-error
const tCollectionB: TCollection = { hash: '0x' }

// @ts-expect-error
const tExecutionB: TExecution = { message: 0 }
