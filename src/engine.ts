import zmq from 'zeromq'

import { Engine, Strategy } from './types'
import { Collector } from './types/collectors'
import { Executor } from './types/executors'

export const useEngine: Engine = () => {
    const collectors: Collector[] = []
    const executors: Executor[] = []
    const strategies: Strategy[] = []

    const addCollector = (collector: Collector) => {
        collectors.push(collector)
    }

    const addExecutor = (executor: Executor) => {
        executors.push(executor)
    }

    const addStrategy = (strategy: Strategy) => {
        strategies.push(strategy)
    }

    const init = () => {
        const event = zmq.socket('pub')
        event.bindSync('tcp://127.0.0.1:3000')

        const action = zmq.socket('pub')
        action.bindSync('tcp://127.0.0.1:3000')

        return [event, action]
    }

    /// The core run loop of the engine. This function will spawn a thread for
    /// each collector, strategy, and executor. It will then orchestrate the
    /// data flow between them.
    const run = async () => {
        const [event, action] = init()

        event
        action

        // Start executors first so that we never collect data that
        // we don't have an executor for.
        const executorsPromise = executors.map(async () => {
            const receiver = action.subscribe('action')

            receiver.on('message', (data) => {
                data
            })
        })

        const strategiesPromises = strategies.map(async () => {
            const receiver = event.subscribe('event')
            const publisher = action

            receiver.on('message', (data) => {
                data // prevent unused reference

                // process event

                // send action to take
                publisher.send(['action', 'data'])
            })
        })

        const collectorsPromises = collectors.map(async () => {
            const publisher = event

            // while next event
            publisher.send(['event', 'data'])
        })

        await Promise.all([
            ...collectorsPromises,
            ...executorsPromise,
            ...strategiesPromises,
        ])
    }

    return {
        collectors,
        executors,
        strategies,
        addCollector,
        addExecutor,
        addStrategy,
        run,
    }
}
