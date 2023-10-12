import { Command } from 'commander'

import config from '@/cli/commands/config'
import init from '@/cli/commands/init'
import start from '@/cli/commands/start'
import strategies from '@/cli/commands/strategies'

const program = new Command()

program
	.name('mev')
	.description('The controlling property of an aggressive long-tail mev bot.')

program
	.command('init')
	.description('Initialize a new mev project.')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
	.action(async options => await init(options))

program
	.command('config')
	.description('List the active configurations.')
	.action(async () => await config())

program
	.command('strategies')
	.description('List all strategies.')
	.action(async () => await strategies())

// TODO: Implement reference generation.

program
	.command('start')
	.description('Run the bot.')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
	.option('-s --strategy <strategy>', 'Strategy to run.')
	.action(async options => await start(options))

program.parse(process.argv)
