import dotenv from 'dotenv'

import { Collector } from '@/core/collector'
import {
	DEFAULT_COLLECTORS,
	DEFAULT_EXECUTORS,
	DEFAULT_NETWORK,
	DEFAULT_NETWORKS,
	DEFAULT_RPC,
	DEFAULT_STRATEGIES
} from '@/core/engine/constants'
import { Executor } from '@/core/executor'

// * Load dotenv config here so that when a user imports the library
//   they automatically have access to process.env based on their .env.
dotenv.config()

export function defineConfig({
	references = {},
	defaultNetwork = DEFAULT_NETWORK,
	networks = DEFAULT_NETWORKS,
	collectors = DEFAULT_COLLECTORS,
	executors = DEFAULT_EXECUTORS,
	strategies = DEFAULT_STRATEGIES
}: Partial<{
	references: Partial<{
		artifacts: string
		etherscan: (address: string) => string
		bytecode: (
			address: string,
			block: number | 'latest' | 'pending'
		) => Promise<string>
		contracts: Record<string, `0x${string}`>
	}>
	defaultNetwork: keyof typeof DEFAULT_RPC
	networks: Record<
		string,
		{
			rpc: `wss://${string}`
		}
	>
	collectors: Array<Collector<any, any>>
	executors: Array<Executor<any>>
	strategies: Record<string, any>
}> = {}) {
	return {
		references,
		defaultNetwork,
		networks,
		collectors,
		executors,
		strategies:
			collectors === DEFAULT_COLLECTORS && executors === DEFAULT_EXECUTORS
				? { ...DEFAULT_STRATEGIES, ...strategies }
				: strategies
	} as const
}
