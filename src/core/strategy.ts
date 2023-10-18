import { Collector } from '@/core/collector'
import { Executor } from '@/core/executor'
import { logger } from '@/lib/logger'

export abstract class Strategy<
	TCollector extends Collector<any, any>,
	TExecutor extends Executor<any, any>
> {
	constructor(public readonly key: string) {}

	syncState = async () =>
		logger.warn(`[${this.key}]: requires no state sync.`)

	abstract processCollection: <TKey>(
		key: TCollector['key'],
		collection: Parameters<TCollector['emit']>[1]
	) => Promise<{
		key: TExecutor['key']
		execution: Parameters<TExecutor['execute']>[0]
	} | void>
}
