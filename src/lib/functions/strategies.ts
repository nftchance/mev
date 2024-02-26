import { Strategy } from "@/core/strategy"
import { Strategies } from "@/lib/types/config"

export function getStrategyNames<TStrategies extends Record<string, unknown>>(
    strategies: TStrategies,
    names: Array<string> = [],
    nameTree: string = ""
): Array<string> {
    if (!strategies) return []

    for (const [key, value] of Object.entries(strategies)) {
        // ! If the accessed object is a Strategy.
        if (value instanceof Strategy) {
            names.push(`${nameTree}${key}`)
        }

        // ! If the accessed object is still an object with values (Record).
        else if (value && typeof value === "object") {
            getStrategyNames(value as TStrategies, names, `${nameTree}${key}.`)
        }

        // ! If the accessed object is a primitive.
        // * While this is not expected, it is possible.
        else if (value && typeof value !== "object") {
            names.push(`${nameTree}${key}`)
        }
    }

    return names
}

export function getStrategy(strategies: Strategies | undefined, name: string) {
    if (strategies === undefined) return

    const pieces = name.split(".")

    let strategy = strategies
    for (const piece of pieces) {
        if (!strategy[piece]) return

        strategy = strategy[piece]
    }

    if (strategy instanceof Strategy) return strategy
}
