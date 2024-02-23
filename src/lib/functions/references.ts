import { useEtherscan } from "../hooks/useEtherscan"
import { format } from "./config"
import { default as fse } from "fs-extra"

import { defineConfig } from "@/core/engine/config"
import { DEFAULT_ETHERSCAN } from "@/core/engine/constants"
import { getArtifacts } from "@/lib/functions/artifacts"
import { logger } from "@/lib/logger"

// * Generate the static Typescript references for the contracts declared.
// ? If the reference was already generated, then we will skip it.
const generateStaticReferences = async ({
    key,
    name,
    address,
    abi,
    bytecode,
    deployedBytecode,
}: {
    key: string
    name: string
    address?: string
    abi: string
    bytecode?: string
    deployedBytecode?: string
}) => {
    if (!fse.existsSync(`./src/references/${key}`))
        fse.mkdirSync(`./src/references/${key}`, {
            recursive: true,
        })

    const file = `./src/references/${key}/index.ts`

    if (fse.existsSync(file)) {
        logger.info(`Reference for ${name} already exists.`)
        return
    }

    const bigName = name.replace(" ", "_").toUpperCase()

    const imports = [address === undefined ? "utils" : "Contract"]

    let protocolGeneration = `
        // Autogenerated file for @${key}. Do not edit.
        import { ${imports} } from 'ethers'

        export const ${bigName}_NAME = '${name}' as const
    `

    if (abi)
        protocolGeneration += `\n
            export const ${bigName}_ABI = ${abi} as const
        `

    if (bytecode)
        protocolGeneration += `\n
            export const ${bigName}_BYTECODE = '${bytecode}' as const
        `

    if (deployedBytecode)
        protocolGeneration += `\n
            export const ${bigName}_DEPLOYED_BYTECODE = '${deployedBytecode}' as const
        `

    if (address !== undefined)
        protocolGeneration += `\n
            export const ${bigName}_ADDRESS = '${address}' as const
        `

    if (address !== undefined && abi !== undefined)
        protocolGeneration += `\n
            export const ${bigName}_CONTRACT = new Contract(
                '${address}',
                ${bigName}_ABI
            )
            export const ${bigName}_INTERFACE = ${bigName}_CONTRACT.interface
        `

    if (address === undefined && abi !== undefined)
        protocolGeneration += `
        export const ${bigName}_INTERFACE = new utils.Interface(
            ${bigName}_ABI
        )`

    const formatted = await format(protocolGeneration)

    fse.writeFileSync(file, formatted)

    logger.info(`Generated ./src/references/${key}/index.ts`)

    // TODO: Used to the Solidity files were generated here using the ABI however due to
    //       continued issues and lack of support for contracts that are on versions earlier
    //       than 5.0 it results in a lot of issues. This will be revisted in the future.
    // NOTE: When you come back to this, probably easiest and best to directly retrieve
    //       the source code from Etherscan and then generate the Solidity file from that.
    //       I am honestly not sure why I didn't just do that originally.
}

const generateDynamicReferences = ({
    name,
    source,
}: {
    name: string
    source: string
}) => {
    if (fse.existsSync(`./src/references/${name}/contracts`)) {
        logger.info(
            `Reference implementation contracts for ${name} already exist.`
        )
        return
    }

    // * Remove the double curly braces from the source code.
    // ! I am not sure why this is happening, but it is solved now.
    source = source.replace("{{", "{")
    source = source.replace("}}", "}")

    try {
        let contractSources: {
            [key: string]: { content: string }
        } = {}

        /// * This handles the case where the source code is a JSON object
        ///   because the contract was verified with a collection of resources.
        if (source.startsWith("{") && source.endsWith("}")) {
            contractSources = JSON.parse(source).sources
        }
        /// * This is for when the contract was flattened and the source code is
        ///   a single string reference. Often done for older contracts.
        else {
            const fileName = `contracts/${name}.sol`
            contractSources = {
                [fileName]: { content: source },
            }
        }

        Object.entries(contractSources).forEach(([sourceKey, value]) => {
            const directory = `./src/references/${name}/${sourceKey
                .replace("./", "")
                .split("/")
                .slice(0, -1)
                .join("/")}`

            const filename = sourceKey.replace("./", "").split("/").slice(-1)[0]

            fse.mkdirSync(directory, {
                recursive: true,
            })

            fse.writeFileSync(`${directory}/${filename}`, value.content)

            logger.info(`Generated ${directory}/${filename}`)
        })
    } catch (error: any) {
        console.log(source)
        logger.error(error.toString())
        logger.error(`Failed to parse the source code for ${name}.`)
    }
}

export const generateReferences = async <
    T extends ReturnType<typeof defineConfig>["references"],
>(
    references: T
) => {
    if (references === undefined) {
        logger.warn("No references defined.")
        return
    }

    // ! Generate the deployed contract references.
    let responses: Array<{
        key: string
        name: string
        address?: string
        abi: string
        bytecode?: string
        deployedBytecode?: string
        source?: string
    }> = []

    // ! Generate the base responses for every 'deployed' contract being retrieved.
    responses = responses.concat(
        await Promise.all(
            Object.entries(references.contracts || []).map(
                async ([key, address]) => {
                    const { abi, source } = await useEtherscan(
                        references.etherscan || DEFAULT_ETHERSCAN,
                        address
                    )

                    return { key, address, name: key, abi, source }
                }
            )
        )
    )

    // ! Generate the base respones for local artifacts (ideally generated by Hardhat).
    // * Get all the files in the artifacts directory.
    responses = responses.concat(await getArtifacts(references))

    await Promise.all(
        responses.map(
            async ({ key, name, address, abi, bytecode, deployedBytecode }) => {
                // ! If the bytecode was not provided, but we can retrieve it, then do so.
                // * This is not the creationCode (deployedBytecode) but the actual bytecode.
                if (references.bytecode && address && bytecode === undefined)
                    bytecode = await references.bytecode(address, "latest")

                await generateStaticReferences({
                    key,
                    name,
                    address,
                    abi,
                    bytecode,
                    deployedBytecode,
                })
            }
        )
    )

    // ! Generate the dynamic references.
    // * If `.source` is undefined, then it is a local artifact and the Solidity
    //   file was already created by the user.
    responses.forEach(({ name, source }) => {
        if (source === undefined) return

        generateDynamicReferences({ name, source })
    })

    logger.success(`References generated for ${responses.length} contracts.`)
}
