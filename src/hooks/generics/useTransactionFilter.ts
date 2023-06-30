import { Contract, TransactionReceipt, WebSocketProvider } from 'ethers'

import { Hook } from '../../types'
import { TransactionFilter } from '../../types/generics'

const useTransactionFilter: Hook<
    {
        provider: WebSocketProvider
        filter: TransactionFilter
    },
    {
        transaction: TransactionReceipt
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
