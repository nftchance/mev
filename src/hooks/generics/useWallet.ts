import { Wallet } from 'ethers'

import { WalletConfiguration } from '../../types'

import { useProvider } from './useProvider'

type TuseWallet = ({
    wallet,
    chainId,
}: {
    wallet: WalletConfiguration
    chainId?: number
}) => Wallet

export const useWallet: TuseWallet = ({ wallet, chainId = 1 }) => {
    const provider = useProvider({ chainId })

    if (!wallet.address) throw new Error('No address provided for @useWallet.')

    if (!wallet.enabled)
        throw new Error(`${wallet.address} is not enabled for @useWallet.`)

    const isValid =
        wallet.chainId &&
        (wallet.chainId === 'all' ||
            (Array.isArray(wallet.chainId) &&
                wallet.chainId.includes(chainId)) ||
            wallet.chainId === chainId)

    if (!isValid)
        throw new Error(
            `Wallet ${wallet.address} is not allowed on chainId ${chainId} in @useWallet.`,
        )

    if (!wallet.privateKey)
        throw new Error(
            `No private key provided for ${wallet.address} in @useWallet.`,
        )

    const walletObject = new Wallet(wallet.privateKey, provider)

    // Make sure that the private key did not map to an unexpected wallet.
    if (walletObject.address !== wallet.address)
        throw new Error(
            `Wallet address ${walletObject.address} does not match provided address ${wallet.address} in @useWallet.`,
        )

    return walletObject
}
