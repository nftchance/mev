import { ethers } from 'ethers'

// * Resource to acquire public RPC node URLs to use as default:
//   - https://chainlist.org/
const DEFAULT_RPC = {
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

const DEFAULT_NETWORK: keyof typeof DEFAULT_RPC = 1

// const DEFAULT_REFERENCES = {
// 	LSSVMPairFactory: '0xb16c1342E617A5B6E4b631EB114483FDB289c0A4',
// 	LSSVMPairEnumerableETH: '0x08CE97807A81896E85841d74FB7E7B065ab3ef05',
// 	Seaport: '0x00000000006c3852cbEf3e08E8dF289169EdE581'
// } as const

export function defineConfig({
	chainId,
	references,
	providers = DEFAULT_RPC
}: Partial<{
	chainId: keyof typeof DEFAULT_RPC
	references: Record<string, `0x${string}`>
	// * Allow independent instances to provide their own providers.
	providers: Record<string, Record<string, `wss://${string}`>>
}> = {}) {
	return {
		// ! Wrap every RPC url in a WebSocketProvider.
		providers: Object.fromEntries(
			Object.entries(providers).map(([key, value]) => [
				key,
				Object.fromEntries(
					Object.entries(value).map(([key, value]) => [
						key,
						new ethers.providers.WebSocketProvider(
							chainId
								? providers[chainId].default
								: providers[DEFAULT_NETWORK].default
						)
					])
				)
			])
		),
		references
	} as const
}
