import { configs } from '@/lib/config'
import { getStrategyNames } from '@/lib/functions/strategies'

export default async function (
	options: Parameters<typeof configs>[number] = {}
) {
	for (const config of await configs(options)) {
		const names = await getStrategyNames(config.strategies)

		console.table(names)
	}
}
