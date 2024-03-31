import {
    arbitrum,
    base,
    degen,
    mainnet,
    optimism,
    polygon,
    zora,
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
        explorer: "https://api.etherscan.io/api",
        explorerHasApiKey: true,
    },
    [optimism]: {
        rpc: "wss://optimism.publicnode.com",
        explorer: "https://api-optimistic.etherscan.io/api",
        explorerHasApiKey: true,
    },
    [polygon]: {
        rpc: "wss://polygon-bor.publicnode.com",
        explorer: "https://api.polygonscan.com/api",
        explorerHasApiKey: true,
    },
    [base]: {
        rpc: "wss://base.publicnode.com",
        explorer: "https://api.basescan.org/api",
        explorerHasApiKey: true,
    },
    [arbitrum]: {
        rpc: "wss://arbitrum-one.publicnode.com",
        explorer: "https://api.arbiscan.io/api",
        explorerHasApiKey: true,
    },
    [zora]: {
        rpc: "https://rpc.zora.energy",
        explorer: "https://explorer.zora.energy/api",
        explorerHasApiKey: false,
    },
    [degen]: {
        rpc: "https://rpc.degen.tips",
        explorer: "https://explorer.degen.tips/api",
        explorerHasApiKey: false,
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
