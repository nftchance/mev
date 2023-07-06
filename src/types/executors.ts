import { ContractTransaction, WebSocketProvider } from 'ethers'

// Parameters of the executors as objects.
export type MempoolExecutorParams = {
    client: WebSocketProvider
}

// Actions that could be taken by executors.
export type GasInfo = {
    // Total profit expected from an opportunity.
    totalProfit: number
    // Percentage of bid profit to use for gas.
    bidPercentage?: number
}

export type SubmitTransaction = {
    transaction: ContractTransaction
    gasInfo?: GasInfo
}

export type Executor<TAction = {}> = <TParams>(
    params: TParams,
) => {
    execute: (params: TAction) => Promise<void>
}
