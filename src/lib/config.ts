import { bundleRequire } from 'bundle-require'
import { findUp } from 'find-up'
import { default as fse } from 'fs-extra'
import { resolve } from 'pathe'
import prettier from 'prettier'

type MaybeArray<T> = T | T[]

type Config = {
	strategies: []
}

const name = 'mev'

const configFiles = [
	`${name}.config.ts`,
	`${name}.config.js`,
	`${name}.config.mjs`,
	`${name}.config.mts`
]

export async function find({
	config,
	root
}: Partial<{ config: string; root: string }> | undefined = {}) {
	const rootDir = resolve(root || process.cwd())

	// ! We already know where the config is.
	if (config) {
		const path = resolve(rootDir, config)

		if (fse.pathExistsSync(path)) return path

		return
	}

	// * We don't know where the config is, so we need to find it.
	return await findUp(configFiles, { cwd: rootDir })
}

export async function load({
	configPath
}: {
	configPath: string
}): Promise<MaybeArray<Config>> {
	const res = await bundleRequire({
		filepath: configPath
	})

	let config = res.mod.default

	if (config.default) config = config.default

	if (typeof config !== 'function') return config

	return await config()
}

export async function usingTypescript() {
	try {
		const cwd = process.cwd()
		const tsconfig = await findUp('tsconfig.json', { cwd })

		return !!tsconfig
	} catch {
		return false
	}
}

export async function format(content: string) {
	const config = await prettier.resolveConfig(process.cwd())

	return prettier.format(content, {
		arrowParens: 'always',
		endOfLine: 'lf',
		parser: 'typescript',
		printWidth: 80,
		semi: false,
		singleQuote: true,
		tabWidth: 4,
		trailingComma: 'none',
		...config,
		// disable all prettier plugins due to potential ESM issues with prettier
		// https://github.com/wagmi-dev/wagmi/issues/2971
		plugins: []
	})
}
