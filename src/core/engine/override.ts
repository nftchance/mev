import { providers, utils, Wallet } from 'ethers'
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
	state: Record<`0x${string}`, any>
	// ! Fake key-value mapping to override individual slots in
	//   the account storage before executing the call.
	stateDiff: Record<`0x${string}`, any>
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
	addStateToAddress = (address: `0x${string}`, state: State) => {
		const isValid = utils.isAddress(address)

		if (!isValid) {
			throw new Error(`Invalid address: ${address}`)
		}

		// ! Maintain the base state already set for this address
		//   override it with the new state if it exists.
		this.state[address] = {
			...this.state[address],
			...state
		}
	}

	// * Add state override to a random address and return address.
	addState = (state: State) => {
		const randomAddress = Wallet.createRandom().address as `0x${string}`

		this.addStateToAddress(randomAddress, state)

		return randomAddress
	}

	// ! If we do not provide the hex values that is okay because
	//   it will automatically be converted to the proper JSON-RPC format.
	hex = (
		transaction: Parameters<
			typeof providers.JsonRpcProvider.hexlifyTransaction
		>[0]
	) => {
		// * This will make all the values of the transaction safe as well as
		//   make sure the `accessList` is all setup.
		return providers.JsonRpcProvider.hexlifyTransaction(transaction)
	}

	// * Simulate the transaction and return the access list and gas used.
	simulate = async (
		transaction: Parameters<typeof this.hex>[0],
		block: number | 'latest' | 'pending'
	): Promise<{
		accessList: AccessList
		gasUsed: `0x${string}`
	}> => {
		return await this.client.send('eth_createAccessList', [
			this.hex(transaction),
			block
		])
	}

	// * Submit an `eth_call` with the state override.
	call = async (
		transaction: Parameters<typeof this.hex>[0],
		block: number | 'latest' | 'pending'
	) => {
		return await this.client.send('eth_call', [
			this.hex(transaction),
			block,
			this.state
		])
	}
}
