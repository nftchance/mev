import dedent from 'dedent'
import { default as fse } from 'fs-extra'
import { resolve } from 'pathe'
import pc from 'picocolors'

import { find, format, usingTypescript } from '@/lib/config'
import { logger } from '@/lib/logger'

export default async function (options: {
	config?: string
	root?: string
	content?: any
}) {
	const configPath = await find({
		config: options.config,
		root: options.root
	})

	if (configPath) {
		logger.info(
			`* Found Emporium configuration file at: \n\t ${pc.gray(
				configPath
			)}`
		)
		return
	}

	const isUsingTypescript = await usingTypescript()
	const rootDir = resolve(options.root || process.cwd())
	let outPath: string

	if (options.config) {
		outPath = resolve(rootDir, options.config)
	} else {
		const extension = isUsingTypescript ? 'ts' : 'js'
		outPath = resolve(rootDir, `emporium.config.${extension}`)
	}

	const defaultConfig = { out: './dist/contracts/' }

	let content: string
	if (isUsingTypescript) {
		const config = options.content ?? defaultConfig
		content = dedent(`
                import { config } from "@nftchance/emporium-types"

                // * With an empty config, default values will be used for all the fields
                //   when generating the Solidity smart contract. For basic usage, this is
                //   probably what you want. If have additional events or need to customize
                //   the static declarations of the contract, you can pass in a partial
                //   config object to override the default values.
                export default config(${JSON.stringify(config)})
            `)
	} else {
		const config = options.content ?? {
			...defaultConfig,
			out: defaultConfig.out.replace(/\.ts$/, '.js')
		}
		content = dedent(`
                // @ts-check
                
                // * With an empty config, default values will be used for all the fields
                //   when generating the Solidity smart contract. For basic usage, this is
                //   probably what you want. If have additional events or need to customize
                //   the static declarations of the contract, you can pass in a partial
                //   config object to override the default values.
                /** @type {import('@nftchance/emporium-types').Config} */
                export default ${JSON.stringify(config)}
            `)
	}

	// ! Run prettier so that we format out the stringified JSON.
	const formatted = await format(content)
	await fse.writeFile(outPath, formatted)

	console.info(
		pc.green(
			`✔︎ Generated Emporium configuration file at: \n\t ${pc.gray(
				outPath
			)}`
		)
	)
}
