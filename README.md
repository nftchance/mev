# 🥵 MEV

This repository contains a Typescript-based "process-parallel" MEV bot that has been evolved throughout the years. What this means, is that instead of creating new scripts and collectors for each of your strategies you can simply reuse the streams of data that already exist. Instead of needing a new `block` collector for every single strategy you run within the EVM ecosystem you can simply reuse a constant feed from one RPC endpoint. By doing this your RPC interactions remain far more managable and you are less limited by scale and throughput.

Inspired by [Artemis](https://github.com/paradigmxyz/artemis) developed by Paradigm the key pieces of this engine can be broken down into:

-   Collectors: Streams of data that consume and forward onchain and offchain events/triggers.
-   Executors: Actions taken when an event is received such as logging, discord message forwarding, mempool entry / general transaction execution.
-   Strategies: Created by combining Collectors and Executors a Strategy coordinates the request and response from each piece of the consumer.

## Getting Started

> [!NOTE]
> When using the bot you will want to create a playground that contains all the individual pieces of your strategies, this repository contains the core engine that is needed to get you up and running. There are no default strategies included at this time. However, you can see an example of implementation at `src/core/strategies/block.log.ts`.

To get started, we will use `pnpm` to install the dependencies and run the bot.

First, install the dependencies:

```bash
pnpm install
```

If you are starting a new bot or do not have a configuration to import, you can run the following command to generate a new configuration file:

```bash
pnpm mev init
```

By running `mev init` a configuration with a base example has been generated at `mev.config.ts` folder of your project root. Just like that, you are up and running. Of course, if there was no configuration to run a money-making bot that would be awesome, wouldn't it? That is not the case here.

With a passing test suite, you are cleared to enable the bot and let it run. With all the effort leading up to here, just run:

```bash
pnpm mev start
```

As your strategies become more complex you will need local interfaces to the contracts that you interact with. To do so, simply run:

```bash
pnpm mev references
```

To see the active state of your configuration and confirm that everything is properly setup you can run:

```bash
pnpm mev config
```

## Your Configuration

As you create and utilize strategies your bot will be managed through a single configuration file. A copy-pasta ready starting point is as follows:

```typescript
import { BlockCollector, defineConfig } from "@nftchance/mev"
import { providers, Wallet } from "ethers"
import { z } from "zod"

const envSchema = z.object({
    ETHERSCAN_API_KEY: z.string(),
    RPC_URL: z.string(),
})

const env = envSchema.parse(process.env)
const client = new providers.WebSocketProvider(env.RPC_URL)
const blockCollector = new BlockCollector(client)

export default defineConfig({
    references: {
        artifacts: "./src/artifacts",
        etherscan: (address: string) =>
            `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apiKey=${env.ETHERSCAN_API_KEY}`,
        bytecode: async (address: string) =>
            await client.getCode(address, "latest"),
        contracts: {
            // ! Uniswap
            UniswapV2Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
            UniswapV3Factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
        },
    },
    collectors: [blockCollector],
    executors: [],
    strategies: {},
})
```
