import { ContractTransaction, Strategy, TransactionFilter } from '../../types'

export const bottedMint: Strategy<TransactionFilter, ContractTransaction> =
    async ({ config, onError, onSuccess }) => {
        onError
        onSuccess

        const call = async () => {
            if (!config.enabled) throw new Error('Strategy is not enabled.')

            // const { call: trigger } = config.trigger[0]({
            //     config: {
            //         provider,
            //         ...config.trigger[1],
            //     },
            // })

            // await trigger()
        }

        return { call }
    }
