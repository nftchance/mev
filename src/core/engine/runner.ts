import yaml from "js-yaml";
import { ethers, providers } from "ethers";

import { Engine } from "./engine";

const env = yaml.load(
    require("fs").readFileSync("./env.yaml", "utf8"),
) as Record<string, Record<string, string>>;

export class Runner {
    // engine
    // Setup block collector
    // Setup opensea order collector
    // Setup strategies
    
    engine = new Engine();

    constructor(
        public readonly provider: providers.WebSocketProvider = new ethers.providers.WebSocketProvider(
            `wss://eth-mainnet.g.alchemy.com/v2/${env.rpcUrls.alchemy}`,
        ),
    ) {
        if (!env.rpcUrls.default) {
            throw new Error("No RPC URL provided.");
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
        await this.engine.run();
    }
}