import { EventEmitter } from 'node:events'

import { Collector } from '@/core/collector'

const key = 'Heartbeat' as const

export type HeartbeatCollection = {
	nonce: number
}

export class HeartbeatCollector extends Collector<
	typeof key,
	HeartbeatCollection
> {
	public static key = key
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
