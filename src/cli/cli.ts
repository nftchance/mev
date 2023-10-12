import { Command } from 'commander'

import { init } from '@/cli/commands/init'
import list from '@/cli/commands/list'
import start from '@/cli/commands/start'

const program = new Command()

program
	.name('mev')
	.description('The controlling property of an aggressive long-tail mev bot.')

program
	.command('init')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
	.action(async options => await init(options))

program
	.command('list')
	.description('List all strategies')
	.action(async () => await list())

program
	.command('start')
	.option('-c --config <config>', 'Path to config file.')
	.option('-r --root <root>', 'Path to root directory.')
	.action(async options => await start(options))

program.parse(process.argv)
