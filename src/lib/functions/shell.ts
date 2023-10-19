import { exec } from 'child_process'

export const execShellCommand = (cmd: string) => {
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.warn(error)
			}
			resolve(stdout ? stdout : stderr)
		})
	})
}
