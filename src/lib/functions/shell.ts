import { exec } from "child_process"

export const shell = (cmd: string) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            }

            resolve(stdout ? stdout : stderr)
        })
    })
}
