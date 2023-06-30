import { StrategyConfigurations } from './types'

import {
    useContract,
    useContractTransaction,
    useWallet,
} from './hooks/generics'

import { bottedMint, example } from './strategies'
import { parseEther } from 'ethers'

import wallets from './wallet.config'

export default {
    example: {
        enabled: false,
        call: example,
    },
    etherMint: {
        enabled: true,
        config: {
            trigger: {
                from: '0x',
                to: useContract({ address: '0x', chainId: 1 }),
                functionName: 'enableClaims',
                status: 'pending',
            },
            action: useContractTransaction({
                from: useWallet({
                    wallet: wallets.nftchance,
                    chainId: 1,
                }),
                contract: { address: '0x' },
                functionName: 'mint',
                value: parseEther('0.1'),
            }),
        },
        call: bottedMint,
    },
} as StrategyConfigurations
