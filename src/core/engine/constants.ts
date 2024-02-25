import { Network } from "@/lib/types/config"

// * Resource to acquire public RPC node URLs to use as default:
//   - https://chainlist.org/
export const DEFAULT_NETWORKS: Record<number, Network> = {
    // ! Mainnet
    1: {
        rpc: "wss://ethereum.publicnode.com",
        etherscan: "https://api.etherscan.io/api",
    },
    // ! Optimism
    10: {
        rpc: "wss://optimism.publicnode.com",
        etherscan: "https://api-optimistic.etherscan.io/api",
    },
    // ! Polygon
    137: {
        rpc: "wss://polygon-bor.publicnode.com",
        etherscan: "https://api.polygonscan.com/api",
    },
    // ! Base
    8453: {
        rpc: "wss://base.publicnode.com",
        etherscan: "https://api.basescan.org/api",
    },
    // ! Arbitrum
    42161: {
        rpc: "wss://arbitrum-one.publicnode.com",
        etherscan: "https://api.arbiscan.io/api",
    },
} as const
