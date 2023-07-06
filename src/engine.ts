// import { EventEmitter } from 'events'

import { BlockCollector } from './types/collectors'

// import { useBlockCollector } from './collectors/block'

export const useEngine = () => {
    const collectors: BlockCollector[] = []

    const addCollector = (collector: any) => {
        collectors.push(collector)
    }

    /// The core run loop of the engine. This function will spawn a thread for
    /// each collector, strategy, and executor. It will then orchestrate the
    /// data flow between them.
    const run = async () => {
        // const emitter = new EventEmitter()

        const collectorsPromises = collectors.map(async () => {})

        await Promise.all([...collectorsPromises])
    }

    return {
        collectors,
        addCollector,
        run,
    }
}
