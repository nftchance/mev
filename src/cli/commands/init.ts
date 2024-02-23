import dedent from "dedent"
import { default as fse } from "fs-extra"
import { resolve } from "pathe"
import pc from "picocolors"

import { find, format, name, usingTypescript } from "@/lib/functions/config"
import { logger } from "@/lib/logger"

export default async function init(
    options: Partial<{
        config: string
        root: string
        content: any
    }>
) {
    const configPath = await find({
        config: options.config,
        root: options.root,
    })

    if (configPath) {
        logger.info(
            `* Found configuration file at: \n\t ${pc.gray(configPath)}`
        )

        return
    }

    // const isUsingTypescript = await usingTypescript()
    const isUsingTypescript = true
    const rootDir = resolve(options.root || process.cwd())

    let outPath: string
    if (options.config) {
        outPath = resolve(rootDir, options.config)
    } else {
        outPath = resolve(
            rootDir,
            `${name}.config.${isUsingTypescript ? "ts" : "js"}`
        )
    }

    let content: string
    const config = options.content ?? {}

    content = dedent(`
            import { defineConfig } from "@nftchance/mev"

            export default defineConfig(${JSON.stringify(config)})
        `)

    // ! Run prettier so that we format out the stringified JSON.
    const formatted = await format(content)
    await fse.writeFile(outPath, formatted)

    // ! Generate tsconfig.json if needed.
    if (
        !fse.existsSync(resolve(rootDir, "tsconfig.json")) &&
        isUsingTypescript
    ) {
        const tsconfig = dedent(`
            {
            	"compilerOptions": {
            		"moduleResolution": "node",
            		"jsx": "preserve",
            		"allowSyntheticDefaultImports": true,
            		"allowImportingTsExtensions": true,
            		"noEmit": true,
            		"allowJs": true,
            		"rootDir": "./",
            		"outDir": "./dist",
            		"sourceMap": true,
            		"declaration": true,
            		"declarationMap": true,
            		"baseUrl": ".",
            		"paths": {
            			"@/*": ["src/*"]
            		},
            		"target": "es2020",
            		"module": "commonjs",
            		"esModuleInterop": true,
            		"forceConsistentCasingInFileNames": true,
            		"strict": true,
            		"skipLibCheck": true
            	},
            	"exclude": ["src/references"]
            }
        `)

        await fse.writeFile(resolve(rootDir, "tsconfig.json"), tsconfig)
    }

    logger.info(`✔︎ Generated configuration file at: \n\t ${pc.gray(outPath)}`)

    process.exit()
}
