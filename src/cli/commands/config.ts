import { configs } from '@/lib/functions/config'

export default async function (
	options: Parameters<typeof configs>[number] = {}
) {
	for (const config of await configs(options)) {
		console.table(
			Object.entries(config).map(([key, value]) => ({
				key,
				value
			}))
		)
	}
}
