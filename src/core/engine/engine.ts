import { EventEmitter } from "node:events"

import { Collector } from "@/core/collector"
import { Executor } from "@/core/executor"
import { Strategy } from "@/core/strategy"
import { logger } from "@/lib/logger"
import { Network } from "@/lib/types/config"

export class Engine<
    TCollectors extends Collector<any, any>,
    TExecutors extends Executor<any, any>,
    TStrategies extends Record<string, Strategy<TCollectors, TExecutors>>,
> {
    constructor(
        public readonly network: Network,
        public readonly strategies: TStrategies,
        public readonly stream: EventEmitter,
        public retries: number = 3,
        public delay = 1000
    ) {
        logger.info(
            `Engine initialized with ${network.collectors.length} collectors, ${
                network.executors.length
            } executors, and ${Object.keys(strategies).length} strategies.`
        )
    }

    restart = (error: unknown) => {
        logger.error(
            `Engine failed while running: ${
                error instanceof Error ? error.message : error
            }`
        )

        if (this.retries === 0) {
            logger.error("Engine has no more retries left. Exiting process.")

            return
        }

        logger.warn(
            `Engine will retry in ${this.delay / 1000} seconds: ${
                this.retries
            } attempts left.`
        )

        this.retries -= 1

        // * Run the Strategy again.
        setTimeout(async () => await this.run(), this.delay)
    }

    run = async () => {
        try {
            // ! Catch actions that are generated by collected events.
            // ! This is run first so that we always have Executors
            //   listening for actions when the collectors start.
            const executorsPromise = this.network.executors.map(
                async (executor) =>
                    this.stream.on(executor.key, async (action) => {
                        await executor.execute(action)
                    })
            )

            const strategiesPromises = Object.entries(this.strategies).map(
                async ([name, strategy]) => {
                    logger.info(`Running Strategy: ${name}`)

                    // ! If the strategy does not have a processCollection method
                    //  then we don't need to do anything and can move on to the next.
                    if (strategy.processCollection === undefined) return

                    // ! Initialize the backfilled state.
                    if (strategy.syncState) await strategy.syncState()

                    // ! Catch and process events as they arrive from the collectors.
                    // * Will emit:
                    //   | 'Execution', ['Log', { ... }]
                    //   | 'Execution', ['SubmitTransaction', { ... }]
                    // ? We use `Collection` as the key because this map is only creating
                    //   a hook per strategy rather than hook per connector per strategy.
                    //   That is not needed for Executors though because we assume them to
                    //   be optimistic which means if we are sending an Execution, it is
                    //   always meant to be run with the body that is provided, thus,
                    //   we can listen for the key of the Execution rather than `Execution`.
                    this.stream.on(
                        "Collection",
                        async ({
                            key,
                            collection,
                        }: {
                            key: TCollectors["key"]
                            collection: Parameters<TCollectors["emit"]>[1]
                        }) => {
                            // * A strategy will always consume the collection however
                            //   that does not mean it will always be used. If there
                            //   is an action that needs to be taken, then we plan
                            //   on passing that to the configured Executors and if there
                            //   is no action to take we will go back to waiting for
                            //   future messages to arrive.
                            const execution = await strategy.processCollection(
                                key,
                                collection
                            )

                            // * If the strategy doesn't emit an action then
                            //   we don't need to do anything and resume listening.
                            if (execution === undefined) return

                            // * Pass the need for Execution to the Executors.
                            this.stream.emit(execution.key, execution.execution)
                        }
                    )
                }
            )

            // ! Sends events that are caught by the strategies.
            // * Will emit:
            //   | 'Collection', ['NewBlock', { ... }]
            //   | 'Collection', ['OpenseaOrder', { ... }]
            const collectorsPromises = this.network.collectors.map(
                async (collector) =>
                    await collector.getCollectionStream(this.stream)
            )

            await Promise.all([
                ...collectorsPromises,
                ...executorsPromise,
                ...strategiesPromises,
            ])
        } catch (error: unknown) {
            this.restart(error)
        }
    }
}
