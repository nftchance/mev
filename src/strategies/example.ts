import { Strategy } from '../types'

export const example: Strategy = async ({ onSuccess }) => {
    const timerPromise = async () =>
        await new Promise((resolve) => {
            let numRepetitions = 0

            while (numRepetitions < 50) {
                numRepetitions++
            }

            resolve(numRepetitions)
        })

    const numRepetitions = await timerPromise()

    onSuccess(numRepetitions)
}
