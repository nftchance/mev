# The Bot Architecture

This Bot has been constructed much different than your typical MEV bot. Typically ultra specialized, an individual running a MEV-based strategy will have several instances running at any given time within the same cloud. This repository is a departure from that with the hard focus on single config files that run a multi-instance cluster.

This means, that at any given time there may be a few or even many different strategies running. This is done to prevent the introduction of systemic technical debt as well as the requirement of porting a strategy into a new MEV framework. Finally, the final major reason is that with the single-instance execution of strategies, that bot can be easily and securely involve several different wallets without fear of losing funds.

> **Note**
> By this implementation it means it is possible to compete against ourselves if one is running two strategies that address the same protocol. This is a known issue and will be addressed in the future.

## The Key Components

At the heart of our MEV framework is the reusable sytem of callbacks, hooks and strategies.

```ml
src
├─ config - "The configuration of the strategies the bot will run."
├─ wallet.config - "The configuration of the wallets in scope."
| 
├─ collectors/ - "Event endpoints that collect data from platforms and blockchains."
├─ executors/ - "Action executions performed in response to Collectors"
├─ strategies/ - "Definition of unique strategy instructions and execution logic."
├─ types/ - "Type definitions for the entire project."
```

As the repository evolves, we have the ability to reuse pieces of the system that we have already developed. For example, by implementing the ability to bot mints we are only a few steps away from being able to bot dex swaps.

## Design Choices

> **Warning**
> In this repository there have been several "odd" decisions made. There are not mistakes are things that need to be fixed, rather they are intentional to accomplish a very specific functionality learned through wisdom of the last years.
>
> Of importance to note here is that there is no Web GUI and there is no plans of one existing. This is a MEV bot, not a MEV bot with a Web GUI. If you want to see the status of your bot, you can check the logs in the terminal or you can check the logs in the `logs` folder. If you only know how to contribute to a project by adding a Web GUI, please do spec one out and submit a PR. I will gladly review it and merge it if it is a good fit, however I would push you to learn how to write a strategy instead as it will fill your pockets much faster than an interface.

## Execution Safe Guards

Built into the foundation of every piece of the framework exist checks to ensure that the bot is not run or used in an unsafe manner largely reliant on type-safety and static analysis. This is abstractly done to prevent the loss of funds, but more accurately to prevent the excessive running of failed transactions, the lack of profit from transaction bundles, and the loss of profit due to the consumption of gas.

There is not an ongoing effort to make this bot "safe" in the sense that it will not lose funds. This is a MEV bot, it is designed to make money and it is designed to make money at the expense of others. If you are not comfortable with this, you should not be running this bot.
