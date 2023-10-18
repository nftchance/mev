import { logger as dLogger, Logger } from '@/lib/logger'

export abstract class Abstract<TKey> {
	constructor(
		public readonly key: TKey,
		public readonly logger: Logger = dLogger
	) {}
}
