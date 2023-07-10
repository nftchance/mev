import { ExtractParams, UnionToIntersection } from './utils'
import { ContractTransaction, WebSocketProvider } from 'ethers'

// Actions that could be taken by executors.
export type SubmitTransaction = (params: {
    client: WebSocketProvider
}) => {
    transaction: ContractTransaction
    gasInfo?: {
        // Total profit expected from an opportunity.
        totalProfit: number
        // Percentage of bid profit to use for gas.
        bidPercentage?: number
    }
}

export type Executor<
    TAction extends (...args: any) => any = () => {},
    TParams = {},
> = (params: UnionToIntersection<ExtractParams<TAction>> & TParams) => {
    execute: (args: ReturnType<TAction>) => Promise<void>
}
