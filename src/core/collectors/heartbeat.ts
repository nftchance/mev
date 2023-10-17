import { EventEmitter } from 'node:events'

import { Collector } from '@/core/collector'

const key = 'Heartbeat' as const

export class HeartbeatCollector extends Collector<typeof key, {}> {
	public nonce = 0

	constructor(public readonly rate: number) {
		super(key)
	}

	getCollectionStream = async (stream: EventEmitter) => {
		setInterval(() => {
			this.emit(stream, {
				nonce: this.nonce++
			})
		}, this.rate)
	}
}

export type HeartbeatCollection = Parameters<HeartbeatCollector['emit']>[1]
