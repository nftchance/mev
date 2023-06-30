import { AddressLike, SigningKey } from 'ethers'

export type Hook<U = {}, T = {}> = (props: {
    enabled?: boolean
    on?: 'block' | 'latest'
    onError?: (error: any) => void
    onSuccess?: (response: any) => void
    config: U
}) => {
    call: () => void
} & Partial<T>

export type Strategy<U = {}> = (props: {
    onError: (error: any) => void
    onSuccess: (response?: any) => void
    config: U
}) => void

export type WalletConfiguration = {
    enabled: boolean
    address?: AddressLike
    privateKey?: string | SigningKey
    chainId?: number | number[] | 'all'
}

export type WalletConfigurations = {
    [key: string]: WalletConfiguration
}

export type StrategyConfiguration = {
    enabled: boolean
    call: Strategy
    config?: any
}

export type StrategyConfigurations = {
    [key: string]: StrategyConfiguration
}
