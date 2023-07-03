export {
    WalletConfiguration,
    WalletConfigurations,
    Hook,
    StrategyConfiguration,
    StrategyConfigurations,
} from './generics'

export { ContractTransaction, TransactionFilter } from './hooks'

export interface Strategy<E, A> {
    sync_state(): Promise<void>
    process_event(event: E): Promise<A | null>
}

export interface Executor<A> {
    execute(action: A): Promise<void>
}
