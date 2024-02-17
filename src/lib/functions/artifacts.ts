import { default as fse } from "fs-extra"
import path from "pathe"

import { defineConfig } from "@/core/engine/config"

async function getJsonFilesInDirectory(directory: string) {
    let jsonFiles: Array<string> = []

    // Ensure the directory exists
    const exists = await fse.pathExists(directory)

    if (!exists) {
        return jsonFiles
    }

    // Read the directory content
    const filesAndDirs = await fse.readdir(directory)

    for (let item of filesAndDirs) {
        const fullPath = path.join(directory, item)
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
    references: ReturnType<typeof defineConfig>["references"],
) {
    return (
        (await getJsonFilesInDirectory(references.artifacts || "./artifacts"))
            // * Filter out the non-json files.
            .filter((file) => file.endsWith(".json"))
            // * Read the json files.
            .map((file) => fse.readFileSync(file).toString())
            // * Parse the json files.
            .map((file) => JSON.parse(file))
            // * Filter out the non-contract artifacts.
            .filter((file) => file.contractName)
            // * Map the json files to the desired format.
            .map((file) => {
                // TODO: Not actually sure if we should use bytecode or deployedBytecode.
                // ! The difference is that deployedBytecode has the constructor bytecode removed.
                let {
                    contractName: name,
                    abi,
                    bytecode,
                    deployedBytecode,
                } = file

                // ! This mostly only happens when it is not a contract that is deployed itself
                //   meaning you will likely want to retrieve the bytecode from the contract
                //   that inherits from it.
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
