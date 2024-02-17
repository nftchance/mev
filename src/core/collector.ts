import { EventEmitter } from "node:events"

import { Abstract } from "@/core/abstract"

export abstract class Collector<
    TKey extends string,
    TCollection,
> extends Abstract<TKey> {
    constructor(public readonly key: TKey) {
        super(key)
    }

    emit(stream: EventEmitter, collection: TCollection) {
        try {
            stream.emit("Collection", { key: this.key, collection })
        } catch (err) {
            this.logger.error(`[${this.key}]: ${err}`)
        }
    }

    abstract getCollectionStream: (stream: EventEmitter) => Promise<void>
}
