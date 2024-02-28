import { WebSocketProvider } from "ethers"
import { EventEmitter } from "node:events"

import { Collector } from "@/core/collector"

const key = "NewBlock" as const

export type BlockCollection = {
    hash: string
    number: number
}

export class BlockCollector extends Collector<typeof key, BlockCollection> {
    constructor(public readonly client: WebSocketProvider) {
        super(key)
    }

    getCollectionStream = async (stream: EventEmitter) => {
        this.client.on("block", async (blockNumber: number) => {
            try {
                const block = await this.client.getBlock(blockNumber)
                const hash = block?.hash
                const number = block?.number

                const ready = hash && number

                if (!ready) {
                    this.logger.warn(
                        `[${this.key}]: Block [${blockNumber}] does not exist.`
                    )
                    return
                }

                this.emit(stream, {
                    hash,
                    number,
                })
            } catch (err) {
                this.logger.error(`[${this.key}] Failed retrieving block.`)
            }
        })
    }
}
