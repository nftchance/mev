import picocolors from "picocolors"

enum LogLevel {
    DEBUG,
    INFO,
    WARN,
    ERROR,
    SUCCESS,
}

export class Logger {
    private logLevel: LogLevel

    constructor(logLevel: LogLevel = LogLevel.INFO) {
        this.logLevel = logLevel
    }

    private log(level: LogLevel, message: string): void {
        if (level >= this.logLevel) {
            const color = this.getColor(level)
            const logMessage = `[${LogLevel[level]}] ${message}`

            console.log(color(logMessage))
        }
    }

    private getColor(level: LogLevel): (message: string) => string {
        switch (level) {
            case LogLevel.SUCCESS:
                return picocolors.green
            case LogLevel.DEBUG:
                return picocolors.blue
            case LogLevel.INFO:
                return picocolors.blue
            case LogLevel.WARN:
                return picocolors.yellow
            case LogLevel.ERROR:
                return picocolors.red
            default:
                return picocolors.white
        }
    }

    success(message: string): void {
        this.log(LogLevel.SUCCESS, `✔ ${message}`)
    }

    debug(message: string): void {
        this.log(LogLevel.DEBUG, `🐛 ${message}`)
    }

    info(message: string): void {
        this.log(LogLevel.INFO, `ℹ ${message}`)
    }

    warn(message: string): void {
        this.log(LogLevel.WARN, `⚠ ${message}`)
    }

    error(message: string): void {
        this.log(LogLevel.ERROR, `✖ ${message}`)
    }
}

export const logger = new Logger()
