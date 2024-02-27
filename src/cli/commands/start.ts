import EventEmitter from "node:events"

import { Engine } from "@/core/engine/engine"
import { configs } from "@/lib/functions/config"
import { getStrategy } from "@/lib/functions/strategies"
import { logger } from "@/lib/logger"

type Props = Partial<{
    strategy: string
}> &
    Parameters<typeof configs>[0]

export default async function (options: Props = {}) {
    const { strategy: strategyName } = options

    let engines = []

    for (const config of await configs(options)) {
        for (const networkIndex in config.networks) {
            const network = config.networks[networkIndex]

            // * Save a reference here because the user may be running a
            //   specific strategy and we don't want to run all of them.
            let strategies = network.strategies

            if (strategyName) {
                const strategy = getStrategy(network.strategies, strategyName)

                if (strategy === undefined) continue

                strategies = { [strategyName]: strategy }
            }

            if (Object.keys(network.strategies).length === 0) continue

            // * Run the Engine with a specific or all strategies.
            engines.push(
                new Engine(
                    network,
                    strategies,
                    new EventEmitter(),
                    config.retries,
                    config.delay
                )
            )
        }
    }

    if (engines.length === 0) {
        logger.warn("No Strategies or Engines to run.")
        process.exit()
    }

    // * Run all the engines and wait for them all to settle. They will
    //   be long running processes though, so we don't really expect them
    //   all to settle. If they do, that means they've errored out or
    //   completed and so the entire process should exit.
    await Promise.all(engines.map((engine) => engine.run()))
}
