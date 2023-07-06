import { ContractTransaction, WebSocketProvider } from 'ethers'

// Actions that could be taken by executors.
export type GasInfo = {
    // Total profit expected from an opportunity.
    totalProfit: number
    // Percentage of bid profit to use for gas.
    bidPercentage?: number
}

export type SubmitTransaction = (params: {
    client: WebSocketProvider
}) => {
    transaction: ContractTransaction
    gasInfo?: GasInfo
}

export type Executor<TAction = {}> = <TParams>(
    params: TParams,
) => {
    execute: (params: TAction) => Promise<void>
}
