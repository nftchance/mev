import DEFAULT_CONFIG from '@/core/engine/config'
import { Engine } from '@/core/engine/engine'

export class Runner {
	constructor(
		public readonly config = DEFAULT_CONFIG,
		public readonly engine = new Engine()
	) {
		if (!config.env.rpcUrls.default) {
			throw new Error('No RPC URL provided.')
		}

		// if (!env.default.privateKey) {
		//     throw new Error("No private key provided.");
		// }

		// const client = new Wallet(env.privateKeys.default, provider);

		// if (!env.opensea.default) {
		//     throw new Error("No Opensea API key provided.");
		// }

		// const openseaStreamClient = new OpenSeaStreamClient({
		//     token: env.opensea.default,
		// });

		// const openseaSDK = new OpenSeaSDK(provider, {
		//     chain: Chain.Mainnet,
		//     apiKey: env.opensea.default,
		// });
	}

	async run() {
		await this.engine.run()
	}
}
