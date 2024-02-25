import { configs } from "@/lib/functions/config"
import { getStrategyNames } from "@/lib/functions/strategies"

export default async function (
    options: Parameters<typeof configs>[number] = {}
) {
    for (const config of await configs(options)) {
        for (const networkIndex in config) {
            const network = config[networkIndex]

            if (Object.keys(network.strategies).length === 0) continue

            const names = getStrategyNames(network.strategies)

            console.table(
                names.map((name) => ({
                    name,
                }))
            )
        }
    }

    process.exit()
}
