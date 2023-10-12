import { configs } from '@/lib/functions/config'

export default async function (options: Parameters<typeof configs>[0] = {}) {
	for (const config of await configs(options)) {
		// TODO: run the engine with the config
	}
}
