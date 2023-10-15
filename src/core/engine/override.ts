import { providers, Transaction, utils, Wallet } from 'ethers'
import { AccessList } from 'ethers/lib/utils'

// ! Geth Implementation Reference used to architect this class:
//   https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-eth

export type State = Partial<{
	// * Fake balance to set for the account before executing the call.
	balance: `0x${string}`
	// * Fake nonce to set for the account before executing the call.
	nonce: `0x${string}`
	// ! Bytecode reference to override the slot with.
	code: `0x${string}`
	// ! Fake key-value mapping to override all slots in the
	//   account storage before executing the call.
	state: Record<any, any>
	// ! Fake key-value mapping to override individual slots in the account
	//   storage before executing the call.
	stateDiff: Record<any, any>
}>

export class StateOverride<T extends providers.JsonRpcProvider> {
	state: Record<
		`0x${string}`,
		// ! All numerical values should be hex encoded and not their raw values.
		State
	> = {}

	constructor(
		public readonly client: T,
		public readonly fast = false
	) {}

	// * Add the state override to an adddress.
	addStateToAddress = async (address: `0x${string}`, state: State) => {
		const isValid = utils.isAddress(address)

		if (!isValid) {
			throw new Error(`Invalid address: ${address}`)
		}

		this.state[address] = {
			...this.state[address],
			...state
		}
	}

	// * Add state override to a random address and return address.
	addState = async (state: State) => {
		const randomAddress = Wallet.createRandom().address as `0x${string}`

		this.addStateToAddress(randomAddress, state)

		return randomAddress
	}

	// * Simulate the transaction and return the access list and gas used.
	simulate = async (
		transaction: Transaction,
		block: number | 'latest' | 'pending'
	): Promise<{
		accessList: AccessList
		gasUsed: `0x${string}`
	}> => {
		return await this.client.send('eth_createAccessList', [
			transaction,
			block
		])
	}

	// * Submit an `eth_call` with the state override.
	call = async (
		transaction: Transaction,
		block: number | 'latest' | 'pending'
	) => {
		// ! Calculate the `accessList` if it has not been declared.
		// * When building for speed, we do not want to calculate the
		//   access list for every call. Instead, we want to calculate
		//   it once and then use the same access list for every call
		//   so you can toggle the `fast` flag to true to bypass this.
		if (this.fast === false && transaction.accessList === undefined) {
			const accessList = (await this.simulate(transaction, block))
				.accessList

			transaction = {
				...transaction,
				accessList
			}
		}

		return await this.client.send('eth_call', [
			transaction,
			block,
			this.state
		])
	}
}
