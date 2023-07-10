import { Engine, Strategy } from './types'
import { Collector } from './types/collectors'
import { Executor } from './types/executors'

export const useEngine: Engine = ({ publisher, receiver }) => {
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

    /// The core run loop of the engine. This function will spawn a thread for
    /// each collector, strategy, and executor. It will then orchestrate the
    /// data flow between them.
    const run = async () => {
        // Start executors first so that we never collect data that
        // we don't have an executor for.
        const executorsPromise = executors.map(async (executor) => {
            // Subscribe to the incoming actions.
            // TODO: Need to make this use the key.
            receiver.subscribe('action')

            try {
                // Process actions as they arrive.
                receiver.on('message', async (action) => {
                    try {
                        // Execute the action (catching the throw if it fails)
                        await executor.execute(JSON.parse(action))
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
                    const parsedEvent: Event = JSON.parse(event)

                    const eventAction = await strategy.processEvent(parsedEvent)

                    // If the strategy doesn't emit an action then we don't
                    // need to do anything.
                    if (eventAction === null) return

                    try {
                        // Send the action to the action socket.
                        publisher.send(['action', JSON.stringify(eventAction)])
                    } catch (err) {
                        console.error('Error sending action', err)
                    }
                })
            } catch (err) {
                console.error('Error receiving event', err)
            }
        })

        const collectorsPromises = collectors.map(async (collector) => {
            try {
                // Start collectors last so that we don't start collecting
                // data before we have a strategy for it.
                collector.stream.on('message', (event: Event) => {
                    try {
                        // Send the event to the event socket.
                        publisher.send(['event', JSON.stringify(event)])
                    } catch (err) {
                        console.error('Error sending event', err)
                    }
                })

                // The publisher interaction takes place within the collector.
                await collector.getEventStream()
            } catch (err) {
                console.error('Error getting event stream', err)
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
