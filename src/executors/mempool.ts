import { ContractTransaction, providers } from 'ethers'

import { Executor } from '../lib/types/executors'

// ! Actions that could be taken by executors.
export type MempoolTransaction = (params: {
    client: providers.WebSocketProvider
}) => {
    transaction: ContractTransaction
    gasInfo?: {
        // Total profit expected from an opportunity.
        totalProfit: number
        // Percentage of bid profit to use for gas.
        bidPercentage?: number
    }
}

export const useMempoolTransaction: Executor<MempoolTransaction> = ({
    client,
}) => {
    const execute = async ({
        transaction,
        gasInfo,
    }: ReturnType<MempoolTransaction>) => {
        client
        transaction
        gasInfo

        // const gasUsage = await client.estimateGas(transaction)
        // gasUsage

        // let bidGasPrice = 0n
        // if (gasInfo !== undefined && gasInfo.bidPercentage !== undefined) {
        //     // Gas price at which we'd break event, meaning 100% of profit goes to validator.
        //     const breakEvenGasPrice =
        //         BigInt(gasInfo.totalProfit) / BigInt(gasUsage)

        //     // Gas price corresponding to the bid percentage.
        //     bidGasPrice = breakEvenGasPrice * BigInt(gasInfo.bidPercentage)
        // } else {
        //     // Use the blocks current gas price if one was not provided.
        //     const feeData = await client.getFeeData()

        //     bidGasPrice = feeData?.maxFeePerGas ?? 0n
        // }

        // // Update the gas price in the transaction.
        // // TODO: Gas "could" be zero if the block doesn't get mined.
        // transaction.gasPrice = bidGasPrice

        // // TODO: Send the transaction.
        // // await client.send
    }

    return { execute }
}
