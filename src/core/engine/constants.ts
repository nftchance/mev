import { BlockCollector } from '../collectors/block'
import { LogExecutor } from '../executors/log'
import { providers } from 'ethers'

import { BlockLog } from '@/core/strategies/block.log'

// * Resource to acquire public RPC node URLs to use as default:
//   - https://chainlist.org/
export const DEFAULT_RPC = {
	// ! Mainnet
	1: {
		default: 'wss://ethereum.publicnode.com'
	},
	// ! Optimism
	10: {
		default: 'wss://optimism.publicnode.com'
	},
	// ! Polygon
	137: {
		default: 'wss://polygon-bor.publicnode.com'
	},
	// ! Base
	8453: {
		default: 'wss://base.publicnode.com'
	},
	// ! Arbitrum
	42161: {
		default: 'wss://arbitrum-one.publicnode.com'
	}
} as const

export const DEFAULT_PROVIDERS = Object.fromEntries(
	Object.entries(DEFAULT_RPC).map(([key, value]) => [
		key,
		Object.fromEntries(
			Object.entries(value).map(([key, value]) => [
				key,
				new providers.WebSocketProvider(value)
			])
		)
	])
)

export const DEFAULT_NETWORK: keyof typeof DEFAULT_RPC = 1

const provider = new providers.WebSocketProvider(
	DEFAULT_RPC[DEFAULT_NETWORK].default
)

export const DEFAULT_COLLECTORS = [new BlockCollector(provider)]
export const DEFAULT_EXECUTORS = [new LogExecutor()]

export const DEFAULT_STRATEGIES = {
	block: {
		log: new BlockLog()
	}
} as const

export const DEFAULT_NETWORKS = {} as const

export const DEFAULT_ETHERSCAN = (address: string): string => {
	throw new Error(
		'Must implement `etherscan()` in `mev.config.ts.defineConfig({ references: { etherscan: <function> }})` to generate references for deployed contracts.'
	)
}
