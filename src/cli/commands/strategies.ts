import { configs } from '@/lib/functions/config'
import { getStrategyNames } from '@/lib/functions/strategies'

export default async function (
	options: Parameters<typeof configs>[number] = {}
) {
	for (const config of await configs(options)) {
		const names = getStrategyNames(config.strategies)
		const statuses = names.map(() => 'PENDING')

		console.table(
			names.map((name, index) => ({
				name,
				status: statuses[index]
			}))
		)
	}

	process.exit()
}
