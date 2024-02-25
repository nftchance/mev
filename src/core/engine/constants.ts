import { Network } from "@/lib/types/config"

// * Resource to acquire public RPC node URLs to use as default:
//   - https://chainlist.org/
// TODO: Having to include the blank Collectors, Executors, and Strategies is less
//       than ideal but I do not feel like fixing it right now.
export const DEFAULT_NETWORKS: Record<number, Network> = {
    // ! Mainnet
    1: {
        rpc: "wss://ethereum.publicnode.com",
        etherscan: "https://api.etherscan.io/api",
        collectors: [],
        executors: [],
        strategies: {},
    },
    // ! Optimism
    10: {
        rpc: "wss://optimism.publicnode.com",
        etherscan: "https://api-optimistic.etherscan.io/api",
        collectors: [],
        executors: [],
        strategies: {},
    },
    // ! Polygon
    137: {
        rpc: "wss://polygon-bor.publicnode.com",
        etherscan: "https://api.polygonscan.com/api",
        collectors: [],
        executors: [],
        strategies: {},
    },
    // ! Base
    8453: {
        rpc: "wss://base.publicnode.com",
        etherscan: "https://api.basescan.org/api",
        collectors: [],
        executors: [],
        strategies: {},
    },
    // ! Arbitrum
    42161: {
        rpc: "wss://arbitrum-one.publicnode.com",
        etherscan: "https://api.arbiscan.io/api",
        collectors: [],
        executors: [],
        strategies: {},
    },
}
