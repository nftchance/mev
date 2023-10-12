import { ethers } from 'ethers'
import yaml from 'js-yaml'

const env = yaml.load(
	require('fs').readFileSync('./env.yaml', 'utf8')
) as Record<string, Record<string, string>>

export default {
	env,
	provider: new ethers.providers.WebSocketProvider(
		`wss://eth-mainnet.g.alchemy.com/v2/${env.rpcUrls.alchemy}`
	)
} as const
