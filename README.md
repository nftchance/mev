# MEV Bot

This repository contains the MEV bot that has been evolved throughout the years. This is a culmination of the strategies that I have been able to reverse engineer from previous actors.

> Note:
> In several places in this repository the supply of additional data is required than is simply needed. This is done to prevent loss of funds and maintain safe procedures as the highest priority. No amount of returns can offset the unexpectedly massive loss.

-   [Architecture](./docs/architecture.md)
-   [Configuration](./docs/configuration.md)
-   [Strategies](./docs/strategies.md)
-   [Wallets](./docs/wallets.md)
-   [Testing](./docs/testing.md)

## Getting Started

To get started, we will use `pnpm` to install the dependencies and run the bot.

First, install the dependencies:

```bash
pnpm install
```

If you are starting a new bot or do not have a configuration to import, you can run the following command to generate a new configuration file:

```bash
pnpm init
```

By running `init` a configuration with a base example has been generated at `src/mev.config.ts` folder of your project root. Just like that, you are up and running. Of course, if there was no configuration to run a money-making bot that would be awesome, wouldn't it? That is not the case here.

Go ahead and setup your configuration file with the appropriate values. If you are unsure of what to do, you can check out the [configuration documentation](./docs/configuration.md).

With your configuration file setup, you MUST run the following command to run the test suite and confirm that everything is good to go.

> Note:
> This system does not let you be lazy and risk the loss of funds. When you stand to both, make and lose millions, the time investment is worth it. If you have a problem with this, an active MEV strategy is not something you should be using in the first place.

In the same terminal, just run:

```bash
pnpm test
```

With a passing test suite, you are cleared to enable the bot and let it run. With all the effort leading up to here, just run:

```bash
pnpm start
```

Now in your terminal you will see the bot running each strategy defined in `mev.config.ts`. Before moving on, I understand not wanting and even not being able to run multiple declarative and potentially failing scripts in distinct instances. So, if you want to bypass the sequential test suite (recommended if you are not actively developing functionality) you add `-t` to the end of the start command like:

```bash
pnpm start -t
```
