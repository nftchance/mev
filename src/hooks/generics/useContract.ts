import { Contract, Wallet, WebSocketProvider } from 'ethers'

import { useEtherscan } from './useEtherscan'
import { useProvider } from './useProvider'

type TuseContract = (props: {
    address: string
    abi?: string
    provider?: WebSocketProvider | Wallet
    chainId?: number
}) => Promise<Contract>

export const useContract: TuseContract = async ({
    address,
    abi,
    provider,
    chainId = 1,
}) => {
    if (!provider) provider = useProvider({ chainId })

    const { getAbi } = useEtherscan({ address })

    if (!abi) abi = await getAbi()

    return new Contract(address, abi, provider)
}
