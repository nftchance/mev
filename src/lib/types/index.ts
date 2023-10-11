import { Collector } from "./collectors";
import { Executor } from "./executors";

// // Iterate over the parameters of the event and action and
// // create a union of all of them.
// type ExtractParams<TEvent extends (...args: any) => any> =
//     Parameters<TEvent>[number];

// // https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
// type UnionToIntersection<T> = (
//     T extends any
//         ? (args: T) => any
//         : never
// ) extends (args: infer U) => any
//     ? U
//     : never;

// export type Strategy<
//     TEvents,
//     TActions extends (...args: any) => any,
//     TParams = {},
// > = (
//     // Inherit the parameters from the event and action.
//     params: UnionToIntersection<ExtractParams<TEvents>> &
//         UnionToIntersection<ExtractParams<TActions>> &
//         TParams,
// ) => {
//     // Initialize the strategy and save the state.
//     syncState?: () => Promise<void>;
//     // Process new strategy events when a collector yields them.
//     processEvent: (
//         event: ReturnType<TEvents>,
//     ) => Promise<ReturnType<TActions> | void>;
// };

export type Strategy<TEvents, TActions> = (
    // Inherit the parameters from the event and action.
    params: {
        // Initialize the strategy and save the state.
        syncState?: () => Promise<void>;
        // Process new strategy events when a collector yields them.
        processEvent: (event: TEvents) => Promise<TActions | void>;
    },
) => void;

export type Engine<TEvents, TActions> = () => {
    // Operational components driving the framework.
    collectors: Array<TEvents>;
    executors: Array<TActions>;
    strategies: Array<Strategy<TEvents, TActions>>;

    // Run all of the collectors, executors, and strategies
    // and coordinate the data between each.
    run: () => Promise<void>;
};
