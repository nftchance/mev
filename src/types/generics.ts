import { AddressLike } from 'ethers'

export type TransactionFilter = {
    from: AddressLike | AddressLike[]
    to: AddressLike | AddressLike[]
    functionName: string
    status: 'pending' | 'confirmed' | 'failed' | 'any'
}
