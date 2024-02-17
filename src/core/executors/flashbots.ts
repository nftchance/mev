import {
    FlashbotsBundleProvider,
    FlashbotsPrivateTransactionResponse,
    FlashbotsTransactionResolution,
    RelayResponseError,
} from "@flashbots/ethers-provider-bundle"
import { providers, Wallet } from "ethers"

import { Executor } from "@/core/executor"
import { logger } from "@/lib/logger"

export type FlashbotsExecution = {
    transaction: providers.TransactionRequest
    config?: Partial<{
        // ! How many blocks in the future we will allow settlement within.
        buffer: number
    }>
}

const key = "Flashbots" as const

export class FlashbotsExecutor<
    TExecution extends FlashbotsExecution,
> extends Executor<typeof key, TExecution> {
    public static key = key
    public flashbotsClient: FlashbotsBundleProvider | undefined

    constructor(
        public readonly client: providers.WebSocketProvider,
        public readonly signer: Wallet,
    ) {
        super(key)
    }

    init = async () => {
        this.flashbotsClient = await FlashbotsBundleProvider.create(
            this.client,
            this.signer,
        )
    }

    execute = async (execution: TExecution) => {
        if (!this.flashbotsClient) {
            throw new Error("Flashbots client not initialized")
        }

        const blockNumber = await this.flashbotsClient.getBlockNumber()
        const maxBlockNumber = blockNumber + (execution.config?.buffer ?? 25)

        const privateTransaction = {
            transaction: execution.transaction,
            signer: this.signer,
        }

        let pendingTransaction =
            await this.flashbotsClient.sendPrivateTransaction(
                privateTransaction,
                {
                    maxBlockNumber,
                },
            )

        if ((pendingTransaction as RelayResponseError).error) {
            pendingTransaction = pendingTransaction as RelayResponseError
            logger.error(
                `[Flashbots] Flashbots relay error: ${pendingTransaction.error.message}`,
            )
            return
        }

        // * Wait for the transaction to be included or bypass the window of opportunity.
        pendingTransaction =
            pendingTransaction as FlashbotsPrivateTransactionResponse

        const response = await pendingTransaction.wait()

        if (response === FlashbotsTransactionResolution.TransactionIncluded) {
            logger.success(
                `[Flashbots] Transaction included in block: ${pendingTransaction.transaction.hash}`,
            )
        } else {
            logger.warn(
                `[Flashbots] Transaction not included in block: ${pendingTransaction.transaction.hash}`,
            )
        }
    }
}
