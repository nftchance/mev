import { Strategy } from '../types'
import { NewBlock, OpenseaOrder } from '../types/collectors'
import { SubmitTransaction } from '../types/executors'
import { AddressLike } from '../types/utils'

import { ItemListedEventPayload } from '@opensea/stream-js'
import { Contract, ContractTransaction, ethers } from 'ethers'

const PAIR_FACTORY_DEPLOYMENT_BLOCK = 14650730
const PAIR_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const PAIR_FACTORY_ABI: any[] = []
// const POOL_EVENT_SIGNATURES = []

const ARB_ABI: any[] = [
    'function swapOpenSeaToSudoswap(OrderV2 order, uint256 startAmount, address sudoPool) external',
]

type Event = OpenseaOrder | NewBlock
type Action = SubmitTransaction
type Config = {
    arbContractAddress: AddressLike
    bidPercentage: number
}

export const openseaSudoswapArb: Strategy<Event, Action, Config> = ({
    client,
    openseaClient,
    arbContractAddress,
    bidPercentage,
}) => {
    const pairFactory = new Contract(
        PAIR_FACTORY_ADDRESS,
        PAIR_FACTORY_ABI,
        client,
    )

    const arbContract = new Contract(arbContractAddress, ARB_ABI, client)

    // const stateOverride = undefined
    // const address = undefined
    // const quoter = undefined

    /// Map NFT addresses to a list of Sudo pair addresses which trade that NFT.
    const sudoPools = new Map<AddressLike, AddressLike[]>()
    /// Map Sudo pool addresses to the current bid for that pool (in ETH).
    const poolBids = new Map<AddressLike, bigint>()

    const syncState = async () => {
        // Block in which the pool factory was deployed.
        const fromBlock = PAIR_FACTORY_DEPLOYMENT_BLOCK
        const toBlock = await client.getBlockNumber()

        const poolAddresses = await getNewPools({ fromBlock, toBlock })
        const chunkSize = 200

        // Get current bids and update state for all pools in chunks of 200
        for (let i = 0; i < poolAddresses.length; i += chunkSize) {
            const addresses = poolAddresses.slice(i, i + chunkSize)
            const quotes = await getQuotesForPools(addresses)
            updateInternalPoolState(quotes)
        }
    }

    const processEvent = async (
        event: ReturnType<Event>,
    ): Promise<Action | void> => {
        switch (event.type) {
            case 'NewBlock':
                await processNewBlockEvent(event)
                    .then(() => {})
                    .catch((err) => {
                        // Error out here because it means the system is out of sync.
                        // This is a critical failure and could result in the loss of funds.
                        throw new Error(err)
                    })
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

        // Ignore orders that are not on Ethereum
        if (chainName.toLowerCase() !== 'ethereum') return

        // Ignore orders with non-eth payment
        if (
            event.listing.payment_token.address !== ethers.constants.AddressZero
        )
            return

        // Find the pool with the highest bid for the nft of this order
        const pools = sudoPools.get(contractAddress as AddressLike)

        // TODO: Implement this section
        pools
        // let (max_pool, max_bid) = pools
        //     .iter()
        //     .filter_map(|pool| self.pool_bids.get(pool).map(|bid| (pool, bid)))
        //     .max_by(|a, b| a.1.cmp(b.1))?;

        const [max_pool, max_bid]: [AddressLike, number] = [
            ethers.constants.AddressZero,
            0,
        ]

        // Ignore orders that are not profitable
        if (max_bid <= parseInt(event.listing.base_price)) return

        return await buildArbTransaction(event.listing, max_pool, max_bid)
    }

    // Process new block events, updating the internal state
    const processNewBlockEvent = async (event: ReturnType<NewBlock>) => {
        // Find new pools that were created in the last block
        const newPools = await getNewPools({
            fromBlock: event.number,
            toBlock: event.number,
        })
        // Find new pools that were touched in the last block
        const touchedPools = await getTouchedPools({
            fromBlock: event.number,
            toBlock: event.number,
        })

        // Get quotes for all new and touched pools and update state
        const quotes = await getQuotesForPools([...newPools, ...touchedPools])
        updateInternalPoolState(quotes)
    }

    // Build arb transaction from order hash and pool params
    const buildArbTransaction = async (
        listing: ItemListedEventPayload,
        sudoPool: AddressLike,
        sudoBid: number,
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

        // Parse out the arb contract parameters
        const startAmount = listingData.fulfillment_data.transaction.value
        const totalProfit = startAmount - sudoBid

        // Convert the fulfillment data to an order struct that can be used onchain
        const [_, tokenAddress, tokenId] = listing.item.nft_id.split('/')
        const order = await openseaClient.createBuyOrder({
            asset: {
                tokenAddress,
                tokenId,
            },
            accountAddress,
            startAmount,
            paymentTokenAddress: listing.payment_token.address,
        })

        // Build the arb transaction using our custom contract
        const contractTransaction: ContractTransaction =
            await arbContract.swapOpenSeaToSudoswap.populateTransaction(
                order,
                startAmount,
                sudoPool,
            )

        const mempoolSubmission = {
            transaction: {
                to: contractTransaction.to,
                data: contractTransaction.data,
            },
            gasInfo: {
                totalProfit,
                bidPercentage,
            },
        }

        mempoolSubmission

        return

        // mempoolSubmission

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

    // Get quotes for a list of pools
    const getQuotesForPools: (pools: AddressLike[]) => Promise<void> =
        async () => {
            return
        }

    // Find all the pools that were touched in a given block range
    const getTouchedPools: (props: {
        fromBlock: number
        toBlock: number
    }) => Promise<AddressLike[]> = async ({ fromBlock, toBlock }) => {
        pairFactory

        fromBlock
        toBlock

        return []
    }

    // Find all the pools that were created in a given block range
    const getNewPools: (props: {
        fromBlock: number
        toBlock: number
    }) => Promise<AddressLike[]> = async ({ fromBlock, toBlock }) => {
        pairFactory

        fromBlock
        toBlock

        return []
    }

    // Update the internal state of the strategy with new pool addresses and quotes.
    const updateInternalPoolState: (poolsAndQuotes: any) => void = () => {
        // If a quote is available, update both the poolBids and sudoPools maps.
        poolBids

        // If a quote is not available, remove from both the poolBids and sudoPools maps.
    }

    return { syncState, processEvent }
}
