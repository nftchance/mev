import { Command } from 'commander'

import config from '@/cli/commands/config'
import init from '@/cli/commands/init'
import references from '@/cli/commands/references'
import start from '@/cli/commands/start'
import strategies from '@/cli/commands/strategies'

const program = new Command()

// TODO: There is a bug with open references that appears to be originating from
//       `config()` that results in having to exit the process at the end of the
//       command otherwise it will just hang and remain open for an extended
//       period of time. All references are released when the process exits though,
//       so nothing to really worry about for now.
// ! Note that we need to remove it on start() so that it keeps running
//   from the awaits lol.

program
	.name('mev')
	.description('The controlling property of an aggressive long-tail mev bot.')

program
	.command('init')
	.description('Initialize a new mev project.')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
	.action(init)

program
	.command('config')
	.description('List the active configurations.')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
	.action(config)

program
	.command('strategies')
	.description('List all strategies.')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
	.action(strategies)

program
	.command('references')
	.description('Generate the references for the onchain mechanisms.')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
	.action(references)

program
	.command('start')
	.description('Run the bot.')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
	.option('-s --strategy <strategy>', 'Strategy to run.')
	.action(start)

// Run commander with async/await.
;(async function () {
	await program.parseAsync(process.argv)
})()
