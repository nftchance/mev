import { logger } from "../logger"
import axios from "axios"

const escapeResults = ["Contract source code not verified"]
const terminateResults = ["Invalid API Key"]
const sleepResults = ["Rate limit"]

type EtherscanResponse = {
    abi?: string
    name?: string
    source?: string
}

export const useEtherscan = async (
    url: (address: string) => string,
    key: string,
    address: `0x${string}`,
    remainingRetries = 3
): Promise<EtherscanResponse> => {
    let contract = { abi: undefined, name: undefined, source: undefined }

    const response = await axios.get(url(address))
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

        logger.error(`Failed to get source for ${key}: ${result}.`)

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

        return useEtherscan(url, key, address, remainingRetries - 1)
    }
    /// * Request was successful, but the contract source code could not be retrieved.
    else if (
        escapeResults.some((result) =>
            response.data.result[0].ABI.includes(result)
        )
    ) {
        logger.error(`Source code not verified for ${key}.`)

        return contract
    }

    /// * Request was successful, and the contract source code was retrieved.
    result = result[0]
    const abi = result.ABI
    const name = result.ContractName
    const source = result.SourceCode

    return { abi, name, source }
}
