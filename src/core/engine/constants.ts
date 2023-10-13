import { BlockLog } from '@/core/engine/strategies'

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

export const DEFAULT_NETWORK: keyof typeof DEFAULT_RPC = 1

export const DEFAULT_STRATEGIES = {
	block: {
		log: new BlockLog()
	}
} as const
