import { configs } from "@/lib/functions/config"
import { generateReferences } from "@/lib/functions/references"

export default async function (
    options: Parameters<typeof configs>[number] = {}
) {
    for (const config of await configs(options)) {
        await generateReferences(config.references)
    }

    process.exit()
}
