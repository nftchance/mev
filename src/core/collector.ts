import { EventEmitter } from 'stream'

import errors from '@/lib/errors'
import { Logger, logger } from '@/lib/logger'

type Errors = typeof errors.Collector

export abstract class Collector<TKey extends keyof Errors, TCollection> {
	constructor(
		public readonly key: TKey,
		public readonly errors: Errors[TKey],
		public readonly logger: Logger = logger
	) {}

	emit(stream: EventEmitter, collection: TCollection) {
		try {
			stream.emit('Collection', [this.key, collection])

			logger.success(this.errors.SuccessPublishing(collection))
		} catch (err) {
			logger.error(this.errors.FailedPublishing(err))
		}
	}

	// ! This function is in this class, but the implementation
	//   happens in the child class. This is a design pattern called
	//   the Template Method Pattern.
	getCollectionStream = async (stream: EventEmitter): Promise<void> => {
		throw new Error(
			`Collector [${this.key}]: getEventStream() not implemented.`
		)
	}
}
