import dotenv from "dotenv"

import {
    DEFAULT_NETWORK_CONFIG,
    DEFAULT_NETWORK_REFERENCES,
    DEFAULT_NETWORK_RETRIES,
    DEFAULT_NETWORKS,
} from "@/core/engine/constants"
import { logger } from "@/lib/logger"
import { BaseConfig, Config, Network } from "@/lib/types/config"

dotenv.config()

export const defineConfig = (base: BaseConfig): Config => {
    // * Destructure the network configuration from the base configuration.
    const { networks, ...retries } = base

    const config: Config = {
        // * Set the default retry configuration for the network.
        ...DEFAULT_NETWORK_RETRIES,
        // * Overwrite the default retry configuration with the provided
        //   values when they are not undefined.
        ...retries,
        /// * Set the default networks for the Engine.
        networks: {},
    }

    // * While we have a set of default networks, the configuration only
    //   contains the chains that the user has actually configured.
    for (const networkId in networks) {
        const network: Network = {
            // * Append the default values to the network so that the user
            //   can operate with the default RPC and Explorer URLs when
            //   they are not provided.
            ...DEFAULT_NETWORKS[networkId],
            // * Set the default values of the references for the network.
            // ! Realistically, most implementations of the Engine configuration
            //   will have at least some amount of contract references, but
            //   we can't assume that they will be provided at time of loading.
            ...DEFAULT_NETWORK_REFERENCES,
            // * Set the operational pieces of the Engine as null
            //   and then overwrite them with the provided values
            //   when they are not undefined.
            ...DEFAULT_NETWORK_CONFIG,
            // * Finally set all the fields that the user provided in
            //   their configuration instantiation.
            ...networks[networkId],
        }

        config.networks[networkId] = network
    }

    if (Object.keys(config).length === 0) {
        logger.warn("No networks were configured.")
    }

    return config
}
