import { WebSocketProvider } from 'ethers'

// const rpcUrls = {}
// ;('wss://eth-mainnet.g.alchemy.com/v2/CLG_LCiDZkHaMGRaLQc_yhbhbSiv6NEL')

const useProvider: (props: { chainId: number }) => WebSocketProvider = ({
    chainId,
}) => {
    chainId

    return new WebSocketProvider(
        'wss://eth-mainnet.g.alchemy.com/v2/CLG_LCiDZkHaMGRaLQc_yhbhbSiv6NEL',
    )
}

export { useProvider }
