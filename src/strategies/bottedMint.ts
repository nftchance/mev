import { Strategy } from '../types'

import { onError } from '../callbacks'

import { useProvider, useTransactionFilter } from '../hooks/generics'

export const bottedMint: Strategy = async ({
    config,
    trigger,
    onTrigger,
    onSuccess,
}) => {
    const chainId = 1
    const provider = useProvider({ chainId })

    // const onTrigger: (props: {
    //     blockNumber: number
    //     transactionHash: string
    // }) => void = ({ blockNumber, transactionHash }) => {
    //     console.log(`Block ${blockNumber} - ${transactionHash}`)

    //     // We are ready to mint our tokens.

    //     // Finally, terminate the processing of this strategy with capital balancing.
    //     onSuccess({ blockNumber, transactionHash })
    // }

    // return async () =>
    //     await new Promise(() => {
    //         useTransactionFilter({
    //             onError: onError,
    //             onSuccess: onTrigger,
    //             config: {
    //                 provider,
    //                 // filter: {
    //                 //     ...config,
    //                 // },
    //                 // while: {

    //                 // },
    //             },
    //         })
    //     })
}
