// import { ContractTransaction, providers } from 'ethers'
import { BigNumber, PopulatedTransaction, Wallet } from 'ethers'

import { Executor } from '@/core/executor'

export type MempoolExecution = {
	transaction: PopulatedTransaction
	gasInfo?: {
		totalProfit: number
		bidPercentage?: number
	}
}

export class MempoolExecutor<
	TExecution extends MempoolExecution = MempoolExecution
> extends Executor<TExecution> {
	constructor(public readonly signer: Wallet) {
		super()
	}

	execute = async ({ transaction, gasInfo }: TExecution) => {
		// ! Estimate the gas consumption.
		const gasEstimate = await this.signer.provider.estimateGas(transaction)

		let bidGasPrice = 0n
		if (gasInfo) {
			const breakEvenGasPrice =
				BigInt(gasInfo.totalProfit) / BigInt(gasEstimate.toString())

			// ! A portion of the potential profit is used for gas.
			bidGasPrice =
				(breakEvenGasPrice * BigInt(gasInfo.bidPercentage || 0)) / 100n
		} else {
			// ! Use the blocks current gas price if one was not provided.
			bidGasPrice = await this.signer.provider
				.getFeeData()
				.then(feeData =>
					BigInt(feeData?.maxFeePerGas?.toString() || '0')
				)
		}

		transaction.gasPrice = BigNumber.from(bidGasPrice.toString())

		// ! Send the transaction.
		await this.signer.sendTransaction(transaction)
	}
}
