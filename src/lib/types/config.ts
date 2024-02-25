import { Collector } from "@/core/collector"
import { DEFAULT_NETWORKS } from "@/core/engine/constants"
import { Executor } from "@/core/executor"

export type Artifacts = string

export type References = Record<string, `0x${string}`>

export type Collectors = Array<Collector<any, any>>
export type Executors = Array<Executor<any, any>>
export type Strategies = Record<string, any>

export type Network = {
    rpc: `wss://${string}` | `https://${string}`
    etherscan: string
    collectors: Collectors
    executors: Executors
    strategies: Strategies
} & Partial<{
    etherscanApiKey: string
    artifacts: Artifacts
    references: References
}>

export type Config = Record<keyof typeof DEFAULT_NETWORKS, Network>
