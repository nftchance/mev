import { parseEther } from 'ethers'

import {
    ContractTransaction,
    StrategyConfiguration,
    TransactionFilter,
} from '../types'

import {
    useContractTransaction,
    useTransactionFilter,
    useWallet,
} from '../hooks/generics'

import { bottedMint } from './generics'

import wallets from '../wallet.config'

export const etherMint: StrategyConfiguration<
    TransactionFilter,
    ContractTransaction
> = {
    config: {
        enabled: true,
        trigger: [
            useTransactionFilter,
            {
                from: '0x',
                to: '0x',
                // to: useContract({ address: '0x', chainId: 1 }),
                functionName: 'enableClaims',
                status: 'pending',
            },
        ],
        onTrigger: [
            useContractTransaction,
            {
                from: useWallet({
                    wallet: wallets.nftchance,
                    chainId: 1,
                }),
                contract: { address: '0x' },
                functionName: 'mint',
                value: parseEther('0.1'),
            },
        ],
    },
    call: bottedMint,
}
