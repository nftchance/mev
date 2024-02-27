import {
    arbitrum,
    base,
    mainnet,
    optimism,
    polygon,
} from "@/core/engine/chains"
import {
    NetworkBase,
    NetworkConfig,
    NetworkReferences,
    Retries,
} from "@/lib/types/config"

// * Default retry configuration for the Engine.
export const DEFAULT_NETWORK_RETRIES: Retries = {
    retries: 3,
    delay: 1000,
}

// * Resource to acquire public RPC node URLs to use as default:
//   - https://chainlist.org/
export const DEFAULT_NETWORKS: Record<number, NetworkBase> = {
    [mainnet]: {
        rpc: "wss://ethereum.publicnode.com",
        etherscan: "https://api.etherscan.io/api",
    },
    [optimism]: {
        rpc: "wss://optimism.publicnode.com",
        etherscan: "https://api-optimistic.etherscan.io/api",
    },
    [polygon]: {
        rpc: "wss://polygon-bor.publicnode.com",
        etherscan: "https://api.polygonscan.com/api",
    },
    [base]: {
        rpc: "wss://base.publicnode.com",
        etherscan: "https://api.basescan.org/api",
    },
    [arbitrum]: {
        rpc: "wss://arbitrum-one.publicnode.com",
        etherscan: "https://api.arbiscan.io/api",
    },
}

export const DEFAULT_NETWORK_REFERENCES: NetworkReferences = {
    artifacts: "./artifacts",
    references: {},
}

export const DEFAULT_NETWORK_CONFIG: NetworkConfig = {
    collectors: [],
    executors: [],
    strategies: {},
}
