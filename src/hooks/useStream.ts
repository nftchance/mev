import { EventEmitter } from 'events'

export const useStream = () => {
    const emitter = new EventEmitter()

    return {
        emitter,
        iterator: <T>(event: string) => {
            return {
                next: () =>
                    new Promise<IteratorResult<T>>((resolve) => {
                        emitter.once(event, (value: T) => {
                            resolve({ value, done: false })
                        })
                    }),
                [Symbol.asyncIterator]() {
                    return this
                },
            }
        },
    }
}
