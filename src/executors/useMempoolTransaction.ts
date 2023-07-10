import { Executor, SubmitTransaction } from '../types/executors'

export const useMempoolTransaction: Executor<SubmitTransaction> = ({
    client,
}) => {
    const execute = async ({
        transaction,
        gasInfo,
    }: ReturnType<SubmitTransaction>) => {
        gasInfo

        const gasUsage = await client.estimateGas(transaction)
        gasUsage

        let bidGasPrice = 0n
        if (gasInfo !== undefined && gasInfo.bidPercentage !== undefined) {
            // Gas price at which we'd break event, meaning 100% of profit goes to validator.
            const breakEvenGasPrice =
                BigInt(gasInfo.totalProfit) / BigInt(gasUsage)

            // Gas price corresponding to the bid percentage.
            bidGasPrice = breakEvenGasPrice * BigInt(gasInfo.bidPercentage)
        } else {
            // Use the blocks current gas price if one was not provided.
            const feeData = await client.getFeeData()

            bidGasPrice = feeData?.maxFeePerGas ?? 0n
        }

        // Update the gas price in the transaction.
        // TODO: Gas "could" be zero if the block doesn't get mined.
        transaction.gasPrice = bidGasPrice

        // TODO: Send the transaction.
        // await client.send
    }

    return { execute }
}
