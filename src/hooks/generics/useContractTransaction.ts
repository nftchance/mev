import { TransactionReceipt, Wallet } from 'ethers'

import { useContract } from './useContract'

type TuseContractTransaction = (props: {
    // Base transaction configuration
    from: Wallet
    contract: { address: string }
    functionName: string
    functionArgs?: [string | bigint | number][]
    value?: string | bigint | number
    chainId?: number
    // Utility configuration
    silent?: boolean
    retries?: number
}) => {
    call: (lifecycles?: number) => Promise<TransactionReceipt | null>
}

export const useContractTransaction: TuseContractTransaction = ({
    from,
    contract: contractArgs,
    functionName,
    functionArgs = [],
    value = 0,
    silent = false,
    retries = 0,
}) => {
    const call = async (lifecycles = 0) => {
        const contract = await useContract({
            ...contractArgs,
            provider: from,
        })

        const isValid = contract.interface.hasFunction(functionName)

        if (!isValid)
            throw new Error(
                `Function ${functionName} does not exist on contract in @useContractTransaction.`,
            )

        const unsignedTransaction = await contract[
            functionName
        ].populateTransaction(...functionArgs, {
            value,
        })

        const transaction = await from.sendTransaction(unsignedTransaction)

        const receipt = await transaction.wait(1)

        if (!receipt && !silent) throw new Error('Transaction failed.')

        if (!receipt && retries - lifecycles > 0) await call(lifecycles + 1)

        return receipt
    }

    return { call }
}
