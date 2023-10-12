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
pnpm mev init
```

By running `mev init` a configuration with a base example has been generated at `mev.config.ts` folder of your project root. Just like that, you are up and running. Of course, if there was no configuration to run a money-making bot that would be awesome, wouldn't it? That is not the case here.

With a passing test suite, you are cleared to enable the bot and let it run. With all the effort leading up to here, just run:

```bash
pnpm mev start
```
