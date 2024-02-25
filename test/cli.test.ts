import * as fs from "fs"
import * as os from "os"
import * as path from "pathe"
import { exec, execSync } from "child_process"
import treeKill from "tree-kill"

describe("command line interface", () => {
    let tempDir: string

    let cliPath = path.join(__dirname, "..", "dist", "cli", "cli.js")
    let cli = `node ${cliPath}`

    beforeEach(() => {
        const random = Math.random().toString(36).substring(7)
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `cli-test-${random}-`))
    })

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true })
    })

    it("--help", () => {
        const result = execSync(`${cli} --help`, {
            cwd: tempDir,
        }).toString()

        expect(result).toContain("Usage: mev [options] [command]")
    })

    it("init", () => {
        const result = execSync(`${cli} init`, {
            cwd: tempDir,
        }).toString()

        expect(result).toContain("Generated configuration file at:")
        expect(result).toContain("mev.config.ts")
    })

    it("config", () => {
        const result = execSync(`${cli} config`, {
            cwd: tempDir,
        }).toString()

        expect(result).toContain(
            "Could not find configuration file. Using default."
        )
    })

    it("references", () => {
        const result = execSync(`${cli} references`, {
            cwd: tempDir,
        }).toString()

        // The default configuration does not ship with any included references.
        expect(result).toContain("References generated for 0 contracts.")
    })

    it("start", (done) => {
        let output = ""

        const process = exec(`${cli} start`, {
            cwd: tempDir,
        })

        process.stdout?.on("data", (data) => {
            output += data

            if (output.includes("Running:")) {
                if (process?.pid) {
                    treeKill(process?.pid, "SIGKILL", (err) => {
                        if (err) {
                            console.error("Failed to kill process", err)
                            done(err)
                        } else {
                            expect(output).toContain(
                                "No Strategies or Engines to run."
                            )
                            done()
                        }
                    })
                } else {
                    done(new Error("Process not found"))
                }
            }
        })

        process.on("exit", () => {
            expect(output).toContain("No Strategies or Engines to run.")
            done()
        })
    })

    it("strategies", () => {
        const result = execSync(`${cli} strategies`, {
            cwd: tempDir,
        }).toString()

        expect(result).toContain(
            "Could not find configuration file. Using default."
        )
        expect(result).toContain("block.log")
    })
})
