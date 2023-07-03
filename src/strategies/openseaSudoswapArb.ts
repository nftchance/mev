import { ItemListedEventPayload } from '@opensea/stream-js'
import { AddressLike, WebSocketProvider, ZeroAddress } from 'ethers'
import { OpenSeaSDK } from 'opensea-js'

import { NewBlock, OpenseaOrder } from '../types/collectors'

const PAIR_FACTORY_DEPLOYMENT_BLOCK = 14650730
const PAIR_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const POOL_EVENT_SIGNATURES = []

type Event = NewBlock | OpenseaOrder

export const openseaSudoswapArb = ({
    client,
    openseaClient,
}: { client: WebSocketProvider; openseaClient: OpenSeaSDK }) => {
    const pairFactory = undefined
    const stateOverride = undefined
    const address = undefined
    const quoter = undefined
    const arbContract = undefined

    const bidPercentage = 0

    const sudoPools: { [key: string]: AddressLike[] } = {}
    const poolBids = {}

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

    const processEvent = async (event: Event) => {
        switch (event.type) {
            case 'NewBlock':
                await processNewBlockEvent(event)
                    .then(() => {})
                    .catch((err) => {
                        // Error out here because it means the system is out of sync.
                        // This is a critical failure and could result in the loss of funds.
                        throw new Error(err)
                    })
                break
            case 'OpenseaOrder':
                await processOrderEvent(event)
                break
        }
    }

    // TODO: Implement the OpenSea collector and types
    // Process new OpenSea orders as they come in.
    const processOrderEvent = async (event: OpenseaOrder) => {
        const nftAddress = event.listing.item.nft_id.split('/')[1]

        // Ignore orders that are not on Ethereum
        if (event.listing.item.chain.name.toLowerCase() !== 'ethereum') return

        // Ignore orders with non-eth payment
        if (event.listing.payment_token.address !== ZeroAddress) return

        // Find the pool with the highest bid for the nft of this order
        const pools = sudoPools[nftAddress]

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
        await buildArbTransaction(event.listing, max_pool, max_bid)
    }

    // Process new block events, updating the internal state
    const processNewBlockEvent = async (event: NewBlock) => {
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
    ) => {
        sudoPool

        // TODO: implement the real addresses
        const accountAddress = ZeroAddress
        const protocolAddress = ZeroAddress

        const order = await openseaClient.api.generateFulfillmentData(
            accountAddress,
            listing.order_hash,
            protocolAddress,
            'ask',
        )

        // Parse out the arb contract parameters
        const paymentValue = order.fulfillment_data.transaction.value
        const totalProfit = paymentValue - sudoBid

        // Build the arb transaction
        const tx = {
            tx: undefined,
            gasBidInfo: {
                totalProfit,
                bidPercentage,
            },
        }

        // TODO: Finish here
        tx
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
