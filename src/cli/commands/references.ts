import { configs } from '@/lib/functions/config'
import { generateReferences } from '@/lib/functions/references'

export default async function (
	options: Parameters<typeof configs>[number] = {}
) {
	// TODO: Right now the generation of references can overwrite existing files
	//       in the references directory. This is not ideal, and should be fixed
	//       in the future though it does not really have any active impact beyond
	//       build-time taking longer than it should.

	for (const config of await configs(options)) {
		generateReferences(config.references)
	}
}
