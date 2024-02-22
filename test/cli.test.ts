import * as fs from "fs"
import * as os from "os"
import * as path from "pathe"
import { exec, execSync } from "child_process"

describe("command line interface", () => {
    let tempDir: string

    let cliPath = path.join(__dirname, "..", "dist", "cli", "cli.js")
    let cli = `node ${cliPath}`

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cli-test-"))
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
                process.kill()
            }
        })

        process.on("error", (err) => {
            done(err)
        })

        process.on("exit", () => {
            expect(output).toContain(
                "Engine initialized with 1 collectors, 1 executors, and 1 strategies"
            )
            expect(output).toContain("Running: block")
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
