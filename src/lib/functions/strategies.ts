export function getStrategyNames(
	strategies: Record<string, unknown>,
	names: Array<string> = [],
	nameTree: string = ''
): Array<string> {
	if (!strategies) return []

	for (const [key, value] of Object.entries(strategies)) {
		if (typeof value === 'function') {
			names.push(`${nameTree}${key}`)
		} else if (value && typeof value === 'object') {
			getStrategyNames(
				value as Record<string, unknown>,
				names,
				`${nameTree}${key}.`
			)
		} else if (value && typeof value !== 'object') {
			names.push(`${nameTree}${key}`)
		}
	}

	return names
}

// Now, create a function that takes the template of 'opensea.internal.bid.overFloor'
// and returns the value of strategies.opensea.internal.bid.overFloor.
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

	return strategy
}
