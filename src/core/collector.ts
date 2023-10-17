import { EventEmitter } from 'node:events'

import { logger as dLogger, Logger } from '@/lib/logger'

export abstract class Collector<TKey extends string, TCollection> {
	constructor(
		public readonly key: TKey,
		public readonly logger: Logger = dLogger
	) {}

	emit(stream: EventEmitter, collection: TCollection) {
		try {
			stream.emit('Collection', { key: this.key, collection })
		} catch (err) {
			this.logger.error(`[${this.key}]: ${err}`)
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
