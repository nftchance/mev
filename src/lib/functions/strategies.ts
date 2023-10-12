export async function getStrategyNames(
	strategies: Record<string, unknown>,
	names: Array<string> = [],
	nameTree: string = ''
): Promise<Array<string>> {
	if (!strategies) return []

	for (const [key, value] of Object.entries(strategies)) {
		if (typeof value === 'function') {
			names.push(`${nameTree}${key}`)
		} else if (value && typeof value === 'object') {
			await getStrategyNames(
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
