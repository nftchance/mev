import { NewBlock } from '../types/collectors'
// import { NewBlock } from '../types/collectors'
import { WebSocketProvider } from 'ethers'

// I want to create an async iterator that yields NewBlock events.
export const useBlockCollector = ({
    client,
}: { client: WebSocketProvider }) => {
    async function* getEventStream(): AsyncGenerator<ReturnType<NewBlock>> {
        while (true) {
            // Wait for the next block event. When it returns, this resolves but
            // the while loop keeps running brining us back to the top of the loop.
            const blockNumber = await new Promise<number>((resolve) => {
                client.once('block', (blockNumber) => resolve(blockNumber))
            })

            // Get the details of the iterated block
            const block = await client.getBlock(blockNumber)

            // If we can't get the block, then we can't do anything with it.
            if (!block?.hash) continue

            const newBlock: ReturnType<NewBlock> = {
                type: 'NewBlock',
                hash: block.hash,
                number: block.number,
            }

            yield newBlock
        }
    }

    return { getEventStream }
}
