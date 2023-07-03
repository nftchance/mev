import { AddressLike, WebSocketProvider } from 'ethers'

import { NewBlock, OpenseaOrder } from '../types/collectors'

const PAIR_FACTORY_DEPLOYMENT_BLOCK = 14650730
const PAIR_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const POOL_EVENT_SIGNATURES = []

type Event = NewBlock | OpenseaOrder

export const openseaSudoswapArb = ({
    client,
}: { client: WebSocketProvider }) => {
    const pairFactory = undefined
    const stateOverride = undefined
    const address = undefined
    const quoter = undefined
    const arbContract = undefined

    const bidPercentage = 0

    const sudoPools = []
    const poolBids = []

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
        // Determine if event is an OpenSea order or a new block and process accordingly
        switch (event.type) {
            case 'NewBlock':
                await processNewBlockEvent(event)
                    .then(() => {})
                    .catch((err) => {
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
        // Ignore orders that are not on Ethereum
        event
        // Ignore orders with non-eth payment
        // Find the pool with the highest bid for the nft of this order
        // Ignore orders that are not profitable
        // Build the arb transaction
        buildArbTransaction()
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
    const buildArbTransaction = async () => {
        // Get full order from OpenSea v2 API
        // Parse out the arb contract parameters
        // Build the arb transaction
    }

    // Get quotes for a list of pools
    const getQuotesForPools: (pools: AddressLike[]) => Promise<void> =
        async () => {
            const quotes = []
        }
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
