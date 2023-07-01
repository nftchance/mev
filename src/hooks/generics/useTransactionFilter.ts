import { Contract, TransactionReceipt } from 'ethers'

import { Hook, TransactionFilter } from '../../types'

const useTransactionFilter: Hook<
    TransactionFilter,
    {
        transactions: TransactionReceipt[]
    }
> = ({ enabled, onSuccess, onError, config }) => {
    const transactions: TransactionReceipt[] = []

    const call = () => {
        try {
            const contract = new Contract(
                config.filter.from as string,
                [],
                config.provider,
            )

            contract.on(config.filter.functionName, () => {
                console.log('on')

                onSuccess?.({ blockNumber: 0, transactionHash: '' })
            })
        } catch (error) {
            onError?.(error)
        }
    }

    if (enabled) {
        call()
    }

    return { transactions, call }
}

export { useTransactionFilter }
