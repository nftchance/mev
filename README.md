# 🥵 MEV

A Typescript-based "process-parallel" MEV bot that has been evolved throughout the years. What this means, is that instead of creating new scripts and collectors for each of your strategies you can simply reuse the streams of data that already exist. Instead of needing a new `block` collector for every single strategy you run within the EVM ecosystem you can simply reuse a constant feed from one RPC endpoint. By doing this your RPC interactions remain far more managable and you are less limited by scale and throughput.

![Installation image](https://github.com/nftchance/mev/blob/main/install.png)

Inspired by [Artemis](https://github.com/paradigmxyz/artemis), the key pieces of this engine can be broken down into:

-   Collectors: Streams of data that consume and forward onchain and offchain events/triggers.
-   Executors: Actions taken when an event is received.
-   Strategies: Organization of Collectors and Executors to form a single-lane outcome.

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

As your strategies become more complex you will need local interfaces to the contracts that you interact with. To do so, simply run:

```bash
pnpm mev references
```

By running `mev init` a configuration with a base example has been generated at `mev.config.ts` folder of your project root. Just like that, you are up and running. Of course, if there was no configuration to run a money-making bot that would be awesome, wouldn't it? That is not the case here.

With a passing test suite, you are cleared to enable the bot and let it run. With all the effort leading up to here, just run:

```bash
pnpm mev start
```
