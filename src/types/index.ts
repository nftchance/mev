import { Collector } from './collectors'
import { Executor } from './executors'

// Iterate over the parameters of the event and action and
// create a union of all of them.
type ExtractParams<TEvent extends (...args: any) => any> =
    Parameters<TEvent>[number]

// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<T> = (
    T extends any
        ? (args: T) => any
        : never
) extends (args: infer U) => any
    ? U
    : never

export type Strategy<
    TEvent extends (...args: any) => any = () => {},
    TAction extends (...args: any) => any = () => {},
    TParams = {},
> = (
    // Inherit the parameters from the event and action.
    params: UnionToIntersection<ExtractParams<TEvent>> &
        UnionToIntersection<ExtractParams<TAction>> &
        TParams,
) => {
    // Initialize the strategy and save the state.
    syncState: () => Promise<void>
    // Process new strategy events when a collector yields them.
    processEvent: (event: ReturnType<TEvent>) => Promise<TAction | void>
}

export type Engine = () => {
    // Operational components driving the framework.
    collectors: Collector[]
    executors: Executor[]
    strategies: Strategy[]

    // Top level state management.
    addCollector: (collector: Collector) => void
    addExecutor: (executor: Executor) => void
    addStrategy: (strategy: Strategy) => void

    // Run all of the collectors, executors, and strategies
    // and coordinate the data between each.
    run: () => Promise<void>
}
