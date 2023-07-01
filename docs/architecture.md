# The Bot Architecture

This Bot has been constructed much different than your typical MEV bot. Typically ultra specialized, an individual running a MEV-based strategy will have several instances running at any given time. This repository is a departure from that with the hard focus on single config files that run in a multi-instance cluster.

This means, that at any given time there may be a few or even many different strategies running. This is done to prevent the introduction of systemic technical debt as well as the requirement of porting a strategy into a new MEV framework. Finally, the final major reason is that with the single-instance execution of strategies, that bot can be easily and securely involve several different wallets without fear of losing funds.

To note though, by this implementation it means it is possible to compete against ourselves if one is running two strategies that address the same protocol. This is a known issue and will be addressed in the future.

## Design Choices

In this repository there have been several "odd" decisions made. There are not mistakes are things that need to be fixed, rather they are intentional to accomplish a very specific functionality learned through wisdom of the last years.

Of importance to note here is that there is no Web GUI and there is no plans of one existing. This is a MEV bot, not a MEV bot with a Web GUI. If you want to see the status of your bot, you can check the logs in the terminal or you can check the logs in the `logs` folder.

## Execution Safe Guards

Built into the foundation of every piece of the framework exist checks to ensure that the bot is not run or used in an unsafe manner. This is abstractly done to prevent the loss of funds, but more accurately to prevent the excessive running of failed transactions, the lack of profit from transaction bundles, and the loss of profit due to the consumption of gas.

## The Key Components

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
