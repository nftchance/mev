import { basename } from 'pathe'
import pc from 'picocolors'

import { find, load } from '@/lib/config'
import { logger } from '@/lib/logger'

function defineConfig() {
	return {}
}

export default async function (
	options: Partial<{
		config: string
		root: string
	}>
) {
	const configPath = await find({
		config: options.config,
		root: options.root
	})

	let configs

	if (configPath) {
		const resolvedConfigs = await load({ configPath })

		const isArrayConfig = Array.isArray(resolvedConfigs)

		configs = isArrayConfig ? resolvedConfigs : [resolvedConfigs]

		logger.info(
			`* Using config at index:\n\t${basename(pc.gray(configPath))}`
		)
	} else {
		configs = [defineConfig()]

		logger.warn(`! Could not find configuration file. Using default.`)
	}

	for (const config of configs) {
		// run the engine with the config
	}
}
