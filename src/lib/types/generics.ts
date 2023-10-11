import { AddressLike, SigningKey } from 'ethers'

export type WalletConfiguration = {
    enabled: boolean
    address?: AddressLike
    privateKey?: string | SigningKey
    chainId?: number | number[] | 'all'
}

export type WalletConfigurations = {
    [key: string]: WalletConfiguration
}

export type Hook<U = {}, T = {}> = (props: {
    enabled?: boolean
    on?: 'block' | 'latest'
    onError?: (error: any) => void
    onSuccess?: (response: any) => void
    config: U
}) => {
    call: (props?: any) => Promise<any>
} & T

type StrategyConfigurationParams<triggerType = {}, onTriggerType = {}> = {
    enabled: boolean
    trigger: [Hook<triggerType>, triggerType]
    onTrigger: [Hook<onTriggerType>, onTriggerType]
}

export type Strategy<triggerType = {}, onTriggerType = {}> = (props: {
    config: StrategyConfigurationParams<triggerType, onTriggerType>
    onError: (error: any) => void
    onSuccess: (response?: any) => void
}) => void

export type StrategyConfiguration<triggerType = {}, onTriggerType = {}> = {
    config: StrategyConfigurationParams<triggerType, onTriggerType>
    call: Strategy<triggerType, onTriggerType>
}

export type StrategyConfigurations = {
    [key: string]: StrategyConfiguration
}
