import { Wallet, providers } from 'ethers'

export type ContractTransaction = {
    // Base transaction configuration
    from: Wallet
    contract: { address: string }
    functionName: string
    functionArgs?: [string | bigint | number][]
    value?: string | bigint | number
    chainId?: number
    // Utility configuration
    silent?: boolean
    retries?: number
}

export type TransactionFilter = {
    provider?: providers.WebSocketProvider
    from: `0x${string}` | Array<`0x${string}`>
    to: `0x${string}` | Array<`0x${string}`>
    functionName: string
    status: 'pending' | 'confirmed' | 'failed' | 'any'
}
