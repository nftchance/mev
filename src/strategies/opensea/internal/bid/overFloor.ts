import { Strategy } from '../../../../lib/types'
import { NewBlock, OpenseaOrder } from '../../../../lib/types/collectors'
import { MempoolTransaction } from '../../../../core/executors/mempool'

import { ItemListedEventPayload } from '@opensea/stream-js'
import { ethers } from 'ethers'

type Event = OpenseaOrder | NewBlock
type Action = MempoolTransaction

export const overFloor: Strategy<Event, Action> = ({
    client,
    openseaClient
}) => {
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

        return await buildTransaction(event.listing)
    }

    // Build arb transaction from order hash and pool params
    const buildTransaction = async (
        listing: ItemListedEventPayload
    ): Promise<Action | undefined> => {
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

        // return useMempoolTransaction({
        //     client,
        //     transaction,
        //     gasInfo: {
        //         totalProfit,
        //         bidPercentage,
        //     },
        // })

        return
    }

    return { processEvent }
}
