import { Strategy } from '@/core/strategy'

export function getStrategyNames<TStrategies extends Record<string, unknown>>(
	strategies: TStrategies,
	names: Array<string> = [],
	nameTree: string = ''
): Array<string> {
	if (!strategies) return []

	for (const [key, value] of Object.entries(strategies)) {
		// ! If the accessed object is a Strategy.
		if (value instanceof Strategy) {
			names.push(`${nameTree}${key}`)
		}

		// ! If the accessed object is still an object with values (Record).
		else if (value && typeof value === 'object') {
			getStrategyNames(value as TStrategies, names, `${nameTree}${key}.`)
		}

		// ! If the accessed object is a primitive.
		// * While this is not expected, it is possible.
		else if (value && typeof value !== 'object') {
			names.push(`${nameTree}${key}`)
		}
	}

	return names
}

export function getStrategy<TStrategies extends Record<string, unknown>>(
	strategies: TStrategies,
	name: string
) {
	const pieces = name.split('.')

	let strategy = strategies as TStrategies
	for (const piece of pieces) {
		if (!strategy[piece]) return

		strategy = strategy[piece] as TStrategies
	}

	if (strategy instanceof Strategy) return strategy
}
