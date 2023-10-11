import { Strategy } from '../lib/types'
import { NewBlock, OpenseaOrder } from '../lib/types/collectors'
import { MempoolTransaction } from '../executors/mempool'
import { AddressLike } from '../lib/types/utils'

import { ItemListedEventPayload } from '@opensea/stream-js'
import { Contract, ContractTransaction, ethers } from 'ethers'

const ARB_ABI: any[] = [
    'function swapOpenSeaToSudoswap(OrderV2 order, uint256 startAmount, address sudoPool) external',
]

type Event = OpenseaOrder | NewBlock
type Action = MempoolTransaction

type Config = {
    arbContractAddress: AddressLike
    bidPercentage: number
}

export const openseaInternalBidOverFloor: Strategy<Event, Action, Config> = ({
    client,
    openseaClient,
    arbContractAddress,
    bidPercentage,
}) => {
    const arbContract = new Contract(arbContractAddress, ARB_ABI, client)

    const processEvent = async (
        event: ReturnType<Event>,
    ): Promise<Action | void> => {
        switch (event.type) {
            case 'OpenseaOrder': {
                const orderAction = await processOrderEvent(
                    event as ReturnType<OpenseaOrder>,
                )

                // If there is a valid order, send off the signal to execute it.
                if (orderAction) return orderAction

                // If an order fails, it is okay and we will just continue as no funds are at risk.
            }
        }
    }

    // Process new OpenSea orders as they come in.
    const processOrderEvent = async (
        event: ReturnType<OpenseaOrder>,
    ): Promise<Action | undefined> => {
        const [chainName, contractAddress] =
            event.listing.item.nft_id.split('/')

        // Ignore orders that are not on Ethereum.
        if (chainName.toLowerCase() !== 'ethereum') return

        // Ignore orders with non-eth payment.
        if (
            event.listing.payment_token.address !== ethers.constants.AddressZero
        )
            return

        return await buildArbTransaction(event.listing)
    }

    // Build arb transaction from order hash and pool params
    const buildArbTransaction = async (
        listing: ItemListedEventPayload
    ): Promise<Action | undefined> => {
        // TODO: implement the real addresses
        const accountAddress = ethers.constants.AddressZero
        const protocolAddress = ethers.constants.AddressZero

        // Generate the order fulfillment data
        const listingData = await openseaClient.api.generateFulfillmentData(
            accountAddress,
            listing.order_hash,
            protocolAddress,
            'ask',
        )

        listingData

        // // Parse out the arb contract parameters
        // const startAmount = listingData.fulfillment_data.transaction.value
        // // const totalProfit = startAmount - sudoBid

        // // Convert the fulfillment data to an order struct that can be used onchain
        // const [_, tokenAddress, tokenId] = listing.item.nft_id.split('/')
        // const order = await openseaClient.createBuyOrder({
        //     asset: {
        //         tokenAddress,
        //         tokenId,
        //     },
        //     accountAddress,
        //     startAmount,
        //     paymentTokenAddress: listing.payment_token.address,
        // })

        // // Build the arb transaction using our custom contract
        // const contractTransaction: ContractTransaction =
        //     await arbContract.swapOpenSeaToSudoswap.populateTransaction(
        //         order,
        //         startAmount,
        //         sudoPool,
        //     )

        // const mempoolSubmission = {
        //     transaction: {
        //         to: contractTransaction.to,
        //         data: contractTransaction.data,
        //     },
        //     gasInfo: {
        //         totalProfit,
        //         bidPercentage,
        //     },
        // }

        // mempoolSubmission

        return

        // TODO: Finish here by returning the prepared transaction
        // return useMempoolTransaction({
        //     client,
        //     transaction,
        //     gasInfo: {
        //         totalProfit,
        //         bidPercentage,
        //     },
        // })
    }

    return { processEvent }
}
