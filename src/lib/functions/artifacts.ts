import { default as fse } from "fs-extra"
import path from "pathe"

import { defineConfig } from "@/core/engine/config"

async function getJsonFilesInDirectory(directory: string) {
    let jsonFiles: Array<string> = []

    const exists = await fse.pathExists(directory)

    if (!exists) return jsonFiles

    const filesAndDirs = await fse.readdir(directory)

    for (let item of filesAndDirs) {
        const fullPath = path.join(directory, item)
        // * Get the directory/file properties.
        const stats = await fse.stat(fullPath)

        // If it's a directory, recurse into it
        if (stats.isDirectory()) {
            const subDirFiles = await getJsonFilesInDirectory(fullPath)
            jsonFiles = jsonFiles.concat(subDirFiles)
        } else if (path.extname(fullPath) === ".json") {
            // If it's a JSON file, add to the list
            jsonFiles.push(fullPath)
        }
    }

    return jsonFiles
}

export async function getArtifacts(
    references: ReturnType<typeof defineConfig>["references"]
) {
    return (
        (await getJsonFilesInDirectory(references.artifacts || "./artifacts"))
            // * Filter out the non-json files.
            .filter((file) => file.endsWith(".json"))
            // * Read and parse the json files.
            .map((file) => JSON.parse(fse.readFileSync(file).toString()))
            // * Filter out the non-contract artifacts.
            .filter((file) => file.contractName)
            // * Map the json files to the desired format.
            .map((file) => {
                let {
                    contractName: name,
                    abi,
                    bytecode,
                    deployedBytecode,
                } = file

                if (bytecode === "0x") bytecode = undefined
                if (deployedBytecode === "0x") deployedBytecode = undefined

                return {
                    key: name.replace(".sol", ""),
                    name,
                    abi: JSON.stringify(abi),
                    bytecode,
                    deployedBytecode,
                }
            })
    )
}
