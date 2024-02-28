import { logger } from "../logger"
import axios from "axios"

import { Network } from "@/lib/types/config"

const escapeResults = ["Contract source code not verified"]
const terminateResults = ["Invalid API Key"]
const sleepResults = ["Rate limit"]

type EtherscanResponse = {
    abi?: string
    name?: string
    source?: string
}

export const getSource = async (
    network: Network,
    name: string,
    address: `0x${string}`,
    remainingRetries = 3
): Promise<EtherscanResponse> => {
    let contract = { abi: undefined, name: undefined, source: undefined }

    if (network.etherscanApiKey === undefined) {
        logger.error(`Etherscan API key is not defined.`)
        return contract
    }

    const url = `${network.etherscan}?module=contract&action=getsourcecode&address=${address}&apiKey=${network.etherscanApiKey}`

    const response = await axios.get(url)
    const message = response.data.message
    let result = response.data.result

    /// * Request submit to Etherscan was not successful.
    if (message === "NOTOK") {
        const shouldRetry =
            terminateResults.every(
                (termination) =>
                    result.toLowerCase().includes(termination.toLowerCase()) ===
                    false
            ) && remainingRetries > 0

        logger.error(`Failed to get source for ${name}: ${result}.`)

        if (!shouldRetry) return contract

        logger.info(`Retrying ${remainingRetries} more times before aborting.`)

        /// * Before retrying, make sure we are not being rate limited. If so, sleep
        /// * for a bit before retrying.
        const shouldSleep = sleepResults.some((result) =>
            result.toLowerCase().includes(result.toLowerCase())
        )

        if (shouldSleep) {
            logger.info(`Sleeping for 5 seconds before retrying.`)
            await new Promise((resolve) => setTimeout(resolve, 5000))
        }

        return getSource(network, name, address, remainingRetries - 1)
    }
    /// * Request was successful, but the contract source code could not be retrieved.
    else if (
        escapeResults.some((result) =>
            response.data.result[0].ABI.includes(result)
        )
    ) {
        logger.error(`Source code not verified for ${name}.`)

        return contract
    }

    /// * Request was successful, and the contract source code was retrieved.
    result = result[0]
    const abi = result.ABI
    const contractName = result.ContractName
    const source = result.SourceCode

    return { abi, name: contractName, source }
}

export const getSources = async (network: Network) => {
    if (
        network.references === undefined ||
        network.references.contracts === undefined
    )
        return []

    return await Promise.all(
        Object.entries(network.references || []).map(
            async ([name, address]) => {
                const { abi, source } = await getSource(network, name, address)

                return { name, address, abi, source }
            }
        )
    )
}
