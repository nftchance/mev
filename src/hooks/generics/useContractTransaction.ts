import { TransactionReceipt } from 'ethers'

import { ContractTransaction, Hook } from '../../types'

import { useContract } from './useContract'

export const useContractTransaction: Hook<
    ContractTransaction,
    {
        call: (props: {
            lifecycles?: number
        }) => Promise<TransactionReceipt | null>
    }
> = ({ enabled = true, config, onSuccess }) => {
    const {
        from,
        contract: contractArgs,
        functionName,
        functionArgs = [],
        value = 0,
        silent = false,
        retries = 0,
    } = config

    const call = async ({ lifecycles = 0 }) => {
        if (!enabled)
            throw new Error('Hook is not enabled in @useContractTransaction.')

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

        // @danger This is a recursive call and may be a loaded gun. Do not use
        //         retries here unless you are certain that you are okay with
        //         failed transaction fees.
        if (!receipt && retries - lifecycles > 0)
            await call({ lifecycles: lifecycles + 1 })

        onSuccess?.(receipt)

        return receipt
    }

    return { call }
}
