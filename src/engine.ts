import zmq from 'zeromq'

import { Engine, Strategy } from './types'
import { Collector } from './types/collectors'
import { Executor } from './types/executors'

const SOCKET = 'tcp://127.0.0.1:3000'

export const useEngine: Engine = () => {
    const collectors: ReturnType<Collector>[] = []
    const executors: ReturnType<Executor>[] = []
    const strategies: ReturnType<Strategy>[] = []

    const addCollector = (collector: ReturnType<Collector>) => {
        collectors.push(collector)
    }

    const addExecutor = (executor: ReturnType<Executor>) => {
        executors.push(executor)
    }

    const addStrategy = (strategy: ReturnType<Strategy>) => {
        strategies.push(strategy)
    }

    const init = (): zmq.Socket[] => {
        // Socket used to send messages to the executors.
        const publisher = zmq.socket('pub')
        publisher.bindSync(SOCKET)

        // Socket used to receive messages from the collectors.
        const receiver = zmq.socket('sub')
        receiver.connect(SOCKET)

        return [publisher, receiver]
    }

    /// The core run loop of the engine. This function will spawn a thread for
    /// each collector, strategy, and executor. It will then orchestrate the
    /// data flow between them.
    const run = async () => {
        const [publisher, receiver] = init()

        // Start executors first so that we never collect data that
        // we don't have an executor for.
        const executorsPromise = executors.map(async (executor) => {
            // Subscribe to the incoming actions.
            receiver.subscribe('action')

            try {
                // Process actions as they arrive.
                receiver.on('message', async (action) => {
                    try {
                        // Execute the action (catching the throw if it fails)
                        await executor.execute(action)
                    } catch (err) {
                        console.error('Error executing action', err)
                    }
                })
            } catch (err) {
                console.error('Error receiving action', err)
            }
        })

        // Start strategies and enable the event stream.
        const strategiesPromises = strategies.map(async (strategy) => {
            // Subscribe to the incoming events emit from the collectors.
            // This is used to manage internal state of strategies as well as to
            // distribute events to the executors when the strategy emits.
            receiver.subscribe('event')

            // Initialize the cached state.
            if (strategy.syncState) await strategy.syncState()

            try {
                // Process events as they arrive from the collectors.
                receiver.on('message', async (event) => {
                    const eventAction = await strategy.processEvent(event)

                    // If the strategy doesn't emit an action then we don't
                    // need to do anything.
                    if (eventAction === null) return

                    try {
                        // Send the action to the action socket.
                        publisher.send(['action', 'data'])
                    } catch (err) {
                        console.error('Error sending action', err)
                    }
                })
            } catch (err) {
                console.error('Error receiving event', err)
            }
        })

        // Start collectors last so that we don't start collecting
        // data before we have a strategy for it.
        const collectorsPromises = collectors.map(async (collector) => {
            // Open a stream of events from the collector.
            const eventStream = await collector.getEventStream()

            // Iterate the event stream and publish the events
            // to the event socket as they arrive. This will run for
            // the lifetime of the collector.
            for await (const event of eventStream) {
                // Distribute the event to all of the strategies.
                try {
                    publisher.send(['event', event])
                } catch (err) {
                    console.error('Error sending event', err)
                }
            }
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
