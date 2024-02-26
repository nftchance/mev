#!/usr/bin/env node
import { Command } from "commander"

import init from "@/cli/commands/init"
import references from "@/cli/commands/references"
import start from "@/cli/commands/start"
import strategies from "@/cli/commands/strategies"

const program = new Command()

program
    .name("mev")
    .description("The controlling property of an aggressive long-tail mev bot.")

program
    .command("init")
    .description("Initialize a new mev project.")
    .option("-c --config <config>", "Path to config file.")
    .option("-r --root <root>", "Path to root directory.")
    .action(init)

program
    .command("strategies")
    .description("List all strategies.")
    .option("-c --config <config>", "Path to config file.")
    .option("-r --root <root>", "Path to root directory.")
    .action(strategies)

program
    .command("references")
    .description("Generate the references for the onchain mechanisms.")
    .option("-c --config <config>", "Path to config file.")
    .option("-r --root <root>", "Path to root directory.")
    .action(references)

program
    .command("start")
    .description("Run the bot.")
    .option("-c --config <config>", "Path to config file.")
    .option("-r --root <root>", "Path to root directory.")
    .option("-s --strategy <strategy>", "Strategy to run.")
    .action(start)

// Run commander with async/await.
;(async function () {
    await program.parseAsync(process.argv)
})()
