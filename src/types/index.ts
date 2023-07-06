import { Collector, NewBlock, OpenseaOrder } from './collectors'
import { SubmitTransaction } from './executors'

// By default, a strategy has no event or action types.
export type Strategy<
    // Events that this strategy is subscribed to
    TEvent = undefined,
    // Actions that this strategy may fire in response to an event
    TAction = undefined,
> = {
    // Loads the state of the strategy into memory upon startup.
    syncState: () => Promise<void>
    // If an action type has been specified for this strategy, return a promise wrapping
    // the action type. Otherwise, return a promise wrapping void.
    processEvent: (
        event: TEvent,
    ) => Promise<TAction extends undefined ? void : TAction>
}

export type Engine = {
    // Operational components driving the framework.
    collectors: Collector[]
    executors: any[]
    strategies: Strategy[]

    // Top level state management.
    addCollector: (collector: Collector) => void
    addExecutor: (executor: any) => void
    addStrategy: (strategy: Strategy) => void

    // Execute the primary strategy.
    run: () => Promise<void>
}

// Strategy declarations.
export type OpenseaSudoswapArbitrageStrategy = Strategy<
    NewBlock | OpenseaOrder,
    SubmitTransaction
>
