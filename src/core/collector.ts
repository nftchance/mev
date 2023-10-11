import { EventEmitter } from "stream";

import { logger, Logger } from '../lib/logger'
import errors from '../lib/errors'

type Errors = typeof errors.Collector

export class Collector<TKey extends keyof Errors, TCollection> { 
    constructor(
        public readonly key: TKey,
        public readonly errors: Errors[TKey],
        public readonly logger: Logger = logger,
    ) { }

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
    getEventStream(stream: EventEmitter) { 
        throw new Error(`Collector [${this.key}]: getEventStream() not implemented.`)
    }
}