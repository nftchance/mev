import { ExtractParams, UnionToIntersection } from './utils'
import { providers } from 'ethers'

import { Socket } from 'zeromq'

// Parameters of the collectors as objects.
export type Event = {
    type: string
}





// Create a collector that has a generic type of TEvent
// and takes a generic type of TParams.
export type Collector<
    TEvent extends (...args: any) => any = () => {},
    TParams = {},
> = (
    // Inherit the parameters from the event and action.
    params: UnionToIntersection<ExtractParams<TEvent>> & TParams,
) => {
    getEventStream: (publisher: Socket) => void
    // getEventStream: () => Promise<ReturnType<TEvent>> | void
}
