# MEV Bot

This repository contains the MEV bot that has been evolved throughout the years. This is a culmination of the strategies that I have been able to reverse engineer from previous actors.

> Note:
> In several places in this repository the supply of additional data is required than is simply needed. This is done to prevent loss of funds and maintain safe procedures as the highest priority. No amount of returns can offset the unexpectedly massive loss.

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

## The Bot Architecture

This Bot has been constructed much different than your typical MEV bot. Typically ultra specialized, an individual running a MEV-based strategy will have several instances running at any given time. This repository is a departure from that with the hard focus on single config files that run in a multi-instance cluster.

This means, that at any given time there may be a few or even many different strategies running. This is done to prevent the introduction of systemic technical debt as well as the requirement of porting a strategy into a new MEV framework. Finally, the final major reason is that with the single-instance execution of strategies, that bot can be easily and securely involve several different wallets without fear of losing funds.

To note though, by this implementation it means it is possible to compete against ourselves if one is running two strategies that address the same protocol. This is a known issue and will be addressed in the future.

### The Key Components

At the heart of our MEV framework is the reusable sytem of callbacks, hooks and strategies.

```ml
src
├─ config - "The configuration of the strategies the bot will run."
├─ wallet.config - "The configuration of the wallets in scope."
| 
├─ callbacks/ - "Top-level utility functions called upon execution reused by many hooks."
├─ hooks/ - "Final-point execution logic for a generally abstracted operation."
├─ strategies/ - "Definition of unique strategy instructions and execution logic."
├─ types/ - "Type definitions for the entire project."
```

As the repository evolves, we have the ability to reuse pieces of the system that we have already developed. For example, by implementing the ability to bot mints we are only a few steps away from being able to bot swaps.

### Design Choices

In this repository there have been several "odd" decisions made. There are not mistakes are things that need to be fixed, rather they are intentional to accomplish a very specific functionality learned through wisdom of the last years.

Of importance to note here is that there is no Web GUI and there is no plans of one existing. This is a MEV bot, not a MEV bot with a Web GUI. If you want to see the status of your bot, you can check the logs in the terminal or you can check the logs in the `logs` folder.

#### Execution Safe Guards

Built into the foundation of every piece of the framework exist checks to ensure that the bot is not run or used in an unsafe manner. This is abstractly done to prevent the loss of funds, but more accurately to prevent the excessive running of failed transactions, the lack of profit from transaction bundles, and the loss of profit due to the consumption of gas.
