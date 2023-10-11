import { Executor } from "../lib/types/executors";

import { Logger } from "../lib/logger";

export type Log = { message: string }

export type LogProps = { logger: Logger }

export type LogExecutor = (params: LogProps) => Log

export const useLog: Executor<LogExecutor> = ({ logger }) => { 
    const execute = async ({ message }: ReturnType<LogExecutor>) => {
        logger.info(message)
    }

    return { execute }
}