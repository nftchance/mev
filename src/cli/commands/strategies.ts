import { configs } from "@/lib/functions/config"
import { getStrategyNames } from "@/lib/functions/strategies"
import { logger } from "@/lib/logger"

export default async function (
    options: Parameters<typeof configs>[number] = {}
) {
    const strategies = []

    for (const config of await configs(options)) {
        for (const networkId in config) {
            const network = config[networkId]

            if (Object.keys(network.strategies).length === 0) continue

            const names = getStrategyNames(network.strategies)

            for (const name of names) {
                strategies.push({
                    chainId: networkId,
                    strategy: name,
                })
            }
        }
    }

    logger.info(
        `${strategies.length} Strateg${
            strategies.length === 1 ? "y" : "ies"
        } found in configuration.`
    )

    console.table(strategies)

    process.exit()
}
