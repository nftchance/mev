import { Collector } from '@/core/collector'
import { Executor } from '@/core/executor'
import { logger } from '@/lib/logger'

export class Strategy<
	TCollector extends Collector<any, any>,
	TExecutor extends Executor<any>
> {
	constructor(public readonly key: string) {}

	syncState = async () =>
		logger.warn(`[${this.key}]: requires no state sync.`)

	processCollection = async (
		key: TCollector['key'],
		collection: Parameters<TCollector['emit']>[1]
	): Promise<Parameters<TExecutor['execute']>[0] | void> => {
		throw new Error('Not implemented.')
	}
}
