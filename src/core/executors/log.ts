import { Executor } from "@/core/executor"
import { logger } from "@/lib/logger"

export type LogExecution = { message: string }

const key = "Log" as const

export class LogExecutor<
    TExecution extends LogExecution = LogExecution,
> extends Executor<typeof key, TExecution> {
    public static key = key

    constructor() {
        super(key)
    }

    execute = async ({ message }: TExecution) => {
        logger.info(message)
    }
}
