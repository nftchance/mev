import { Executor } from '@/core/executor'
import { logger } from '@/lib/logger'

export type LogExecution = { message: string }

export class LogExecutor extends Executor<LogExecution> {
	execute = async ({ message }: LogExecution) => {
		logger.info(message)
	}
}
