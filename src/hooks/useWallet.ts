export const useWallet = () => {}

// import { Wallet } from 'ethers'

// type TuseWallet = ({
//     wallet,
//     chainId,
// }: {
//     wallet: WalletConfiguration
//     chainId?: number
// }) => Wallet

// export const useWallet: TuseWallet = ({ wallet, chainId = 1 }) => {
//     const provider = useProvider({ chainId })

//     if (!wallet.address) throw new Error('No address provided for @useWallet.')

//     if (!wallet.enabled)
//         throw new Error(`${wallet.address} is not enabled for @useWallet.`)

//     // Make sure the wallet is allowed on the chain.
//     // @safety While other places would keep this code from erroring out, it is forcefully
//     //         thrown here to prevent a wallet from ever being used on the wrong chain. The
//     //         local networking of two-wallets would be considered a critical failure.
//     const isValid =
//         wallet.chainId &&
//         (wallet.chainId === 'all' ||
//             (Array.isArray(wallet.chainId) &&
//                 wallet.chainId.includes(chainId)) ||
//             wallet.chainId === chainId)

//     if (!isValid)
//         throw new Error(
//             `Wallet ${wallet.address} is not allowed on chainId ${chainId} in @useWallet.`,
//         )

//     if (!wallet.privateKey)
//         throw new Error(
//             `No private key provided for ${wallet.address} in @useWallet.`,
//         )

//     const walletObject = new Wallet(wallet.privateKey, provider)

//     // Make sure that the private key did not map to an unexpected wallet.
//     // @safety Again prevent a configuration mismatch as this may result in socially linking
//     //         accounts that are not intended.
//     if (walletObject.address !== wallet.address)
//         throw new Error(
//             `Wallet address ${walletObject.address} does not match provided address ${wallet.address} in @useWallet.`,
//         )

//     return walletObject
// }
