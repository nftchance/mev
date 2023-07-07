import { Collector } from './collectors'
import { Executor } from './executors'

type ExtractParams<TEvent extends (...args: any) => any> =
    Parameters<TEvent>[number]

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
> = (
    // Inherit the parameters from the event and action.
    params: UnionToIntersection<ExtractParams<TEvent>> &
        UnionToIntersection<ExtractParams<TAction>>,
) => {
    syncState: () => Promise<void>
    processEvent: (event: ReturnType<TEvent>) => Promise<TAction | void>
}

export type Engine = {
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
