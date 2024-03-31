import { Collector } from "@/core/collector"
import { DEFAULT_NETWORKS } from "@/core/engine/constants"
import { Executor } from "@/core/executor"

export type References = Record<string, `0x${string}`>

export type Collectors = Array<Collector<any, any>>
export type Executors = Array<Executor<any, any>>
export type Strategies = Record<string, any>

export type Retries = {
    retries: number
    delay: number
}

export type NetworkBase = {
    key: string
    rpc: `wss://${string}` | `https://${string}`
    explorer: string
    explorerHasApiKey: boolean
}

export type NetworkReferences = Partial<{
    explorerApiKey: string
}> & {
    artifacts: string
    references: References
}

export type NetworkConfig = {
    collectors: Collectors
    executors: Executors
    strategies: Strategies
}

export type Network = NetworkBase & NetworkReferences & NetworkConfig

export type BaseConfig = Partial<Retries> &
    (
        | Record<
              "networks",
              Record<keyof typeof DEFAULT_NETWORKS, Partial<Network>>
          >
        | undefined
    )

export type Config = Retries & {
    networks: Record<keyof typeof DEFAULT_NETWORKS, Network>
}
