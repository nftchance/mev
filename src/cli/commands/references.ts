import { configs } from "@/lib/functions/config"
import { generateReferences } from "@/lib/functions/references"

export default async function (
    options: Parameters<typeof configs>[number] = {}
) {
    /// * Iterate through all of the configurations that have been provided.
    for (const config of await configs(options)) {
        /// * Iterate through all of the references for each network.
        for (const networkIndex in config.networks) {
            const network = config.networks[networkIndex]

            if (network.references === undefined) return

            // * Generate the references for the network.
            await generateReferences(network)
        }
    }

    process.exit()
}
