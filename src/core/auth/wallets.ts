import * as fs from 'fs'
import * as yaml from 'js-yaml'

export type WalletConfiguration = {
	enabled: boolean
	address?: `0x${string}`
	privateKey?: `0x${string}`
	chainId?: number | number[] | 'all'
}

export type WalletConfigurations = {
	[key: string]: WalletConfiguration
}

const config = yaml.load(fs.readFileSync('env.yaml', 'utf-8')) as {
	[key: string]: {
		[account: string]: {
			enabled: boolean
			address?: `0x${string}`
			privateKey?: `0x${string}`
			chainId?: number
		}
	}
}

export const wallets = {} as { [key: string]: WalletConfiguration }

Object.keys(config.privateKeys).forEach(key => {
	const { enabled = true, ...wallet } = config.privateKeys[key]

	wallets[key] = { enabled, ...wallet }
})
