import { AddressLike, Wallet, WebSocketProvider } from 'ethers'

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
    provider?: WebSocketProvider
    from: AddressLike | AddressLike[]
    to: AddressLike | AddressLike[]
    functionName: string
    status: 'pending' | 'confirmed' | 'failed' | 'any'
}
