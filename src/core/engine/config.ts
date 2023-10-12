import { ethers } from 'ethers'
import { default as fse } from 'fs-extra'
import yaml from 'js-yaml'

import { logger } from '@/lib/logger'

const env = yaml.load(fse.readFileSync('./env.yaml', 'utf8')) as Record<
	string,
	Record<string, string>
>

export function defineConfig() {
	const rpcUrl = env.rpcUrls.default

	if (!rpcUrl) logger.error('! No RPC URL found in env.yaml')

	return {
		provider: new ethers.providers.WebSocketProvider(env.rpcUrls.default)
	} as const
}
