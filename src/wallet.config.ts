import * as fs from 'fs'
import * as yaml from 'js-yaml'

import { WalletConfiguration } from './types'
import { AddressLike } from 'ethers'

type TWallets = {
    [chainId: string]: {
        [key: string]: {
            enabled: boolean
            address?: AddressLike
            privateKey?: string
            chainId?: number
        }
    }
}

const config = yaml.load(fs.readFileSync('env.yaml', 'utf-8')) as TWallets

const wallets = {} as { [key: string]: WalletConfiguration }

Object.keys(config.privateKeys).forEach((key) => {
    const { enabled = true, ...wallet } = config.privateKeys[key]

    wallets[key] = { enabled, ...wallet }
})

export default wallets
