import { BlockCollector } from '@/core/collectors/block'
import { LogExecutor } from '@/core/executors/log'
import { Strategy } from '@/core/strategy'

type TCollection = Parameters<BlockCollector['emit']>[1]
type TExecution = Parameters<LogExecutor['execute']>[0]

export class BlockLog<
	TCollector extends BlockCollector,
    
	TExecutor extends LogExecutor
> extends Strategy<TCollector, TExecutor> {
	// ! A new collection will arrive from the collector every time
	//   a new block is mined. Because this is a basic BlockLog, we
	//   will always pass on a message to the executor.
	processCollection = async (collection: TCollection) => {
		return { message: collection.hash }
	}
}

const tCollectionA: TCollection = { hash: '0x', number: 0 }
// @ts-expect-error
const tCollectionB: TCollection = { hash: '0x' }

const tExecutionA: TExecution = { message: 'Hello, world!' }
// @ts-expect-error
const tExecutionB: TExecution = { message: 0 }
