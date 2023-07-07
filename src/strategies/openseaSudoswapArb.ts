import { ItemListedEventPayload } from '@opensea/stream-js'
import { AddressLike, Contract, ZeroAddress } from 'ethers'
// import { OpenSeaSDK } from 'opensea-js'

import { useMempoolTransaction } from '../hooks'
import { Strategy } from '../types'
import { NewBlock, OpenseaOrder } from '../types/collectors'
import { SubmitTransaction } from '../types/executors'
// import { MempoolTransaction } from '../types/executors'

const PAIR_FACTORY_DEPLOYMENT_BLOCK = 14650730
const PAIR_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const PAIR_FACTORY_ABI: any[] = []
// const POOL_EVENT_SIGNATURES = []

const ARB_ADDRESS = '0x000000'
const ARB_ABI: any[] = [
    'function swapOpenSeaToSudoswap(uint256 order, uint256 startAmount, address sudoPool) external',
]

type Event = OpenseaOrder | NewBlock
type Action = SubmitTransaction

export const openseaSudoswapArb: Strategy<Event, Action> = ({
    client,
    openseaClient,
}) => {
    const pairFactory = new Contract(
        PAIR_FACTORY_ADDRESS,
        PAIR_FACTORY_ABI,
        client,
    )
    pairFactory

    const arbContract = new Contract(ARB_ADDRESS, ARB_ABI, client)

    // const stateOverride = undefined
    // const address = undefined
    // const quoter = undefined

    const bidPercentage = 0

    const sudoPools: { [key: string]: AddressLike[] } = {}
    // const poolBids = {}

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
                if (orderAction) {
                    return orderAction
                }
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
        if (event.listing.payment_token.address !== ZeroAddress) return

        // Find the pool with the highest bid for the nft of this order
        const pools = sudoPools[contractAddress]

        // TODO: Implement this section
        // let (max_pool, max_bid) = pools
        //     .iter()
        //     .filter_map(|pool| self.pool_bids.get(pool).map(|bid| (pool, bid)))
        //     .max_by(|a, b| a.1.cmp(b.1))?;

        // convert the above rust to typescript

        const [max_pool, max_bid] = [ZeroAddress, 0]
        pools

        // Ignore orders that are not profitable
        if (max_bid <= parseInt(event.listing.base_price)) return

        // Build the arb transaction
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
        const accountAddress = ZeroAddress
        const protocolAddress = ZeroAddress

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
        const transaction =
            await arbContract.swapOpenSeaToSudoswap.populateTransaction(
                order,
                startAmount,
                sudoPool,
            )

        // TODO: Finish here by returning the prepared transaction
        return useMempoolTransaction({
            client,
            transaction,
            gasInfo: {
                totalProfit,
                bidPercentage,
            },
        })
    }

    // Get quotes for a list of pools
    const getQuotesForPools: (pools: AddressLike[]) => Promise<void> =
        async () => {}
    // Find all the pools that were touched in a given block range
    const getTouchedPools: (props: {
        fromBlock: number
        toBlock: number
    }) => Promise<AddressLike[]> = async ({ fromBlock, toBlock }) => {
        fromBlock
        toBlock

        return []
    }
    // Find all the pools that were created in a given block range
    const getNewPools: (props: {
        fromBlock: number
        toBlock: number
    }) => Promise<AddressLike[]> = async ({ fromBlock, toBlock }) => {
        fromBlock
        toBlock

        return []
    }

    // Update the internal state of the strategy with new pool addresses and quotes.
    const updateInternalPoolState: (poolsAndQuotes: any) => void = () => {
        // If a quote is available, update both the poolBids and sudoPools maps.
        // If a quote is not available, remove from both the poolBids and sudoPools maps.
    }

    return { syncState, processEvent }
}
