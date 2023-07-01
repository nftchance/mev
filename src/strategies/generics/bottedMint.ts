import { ContractTransaction, Strategy, TransactionFilter } from '../../types'

import { useProvider } from '../../hooks/generics'

export const bottedMint: Strategy<TransactionFilter, ContractTransaction> =
    async ({ config, onError, onSuccess }) => {
        const chainId = 1
        const provider = useProvider({ chainId })

        onError
        onSuccess

        const call = async () => {
            if (!config.enabled) throw new Error('Strategy is not enabled.')

            const { call: trigger } = config.trigger[0]({
                config: {
                    provider,
                    ...config.trigger[1],
                },
            })

            await trigger()
        }

        return { call }
    }
