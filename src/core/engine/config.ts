import { ethers } from 'ethers'
import yaml from 'js-yaml'

const env = yaml.load(
	require('fs').readFileSync('./env.yaml', 'utf8')
) as Record<string, Record<string, string>>

export function defineConfig() {
	return {
		provider: new ethers.providers.WebSocketProvider(env.rpcUrls.default)
	} as const
}
