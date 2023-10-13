import { Engine } from '@/core/engine/engine'
import { configs } from '@/lib/functions/config'
import { getStrategy } from '@/lib/functions/strategies'
import { logger } from '@/lib/logger'

type Props = Partial<{
	strategy: string
}> &
	Parameters<typeof configs>[0]

export default async function (options: Props = {}) {
	const { strategy: strategyName } = options

	let ran = false

	for (const config of await configs(options)) {
		let strategies: Record<string, unknown> = config.strategies

		if (strategyName) {
			const strategy = getStrategy<typeof config.strategies>(
				config.strategies,
				strategyName
			)

			if (strategy === undefined) {
				logger.warn(`Strategy ${strategyName} not found.`)
				continue
			}

			strategies = { strategyName: strategy }
		}

		ran = true

		await new Engine(config).run()
	}

	if (!ran) logger.warn('No strategies were run.')
}
