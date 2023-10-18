import { Executor } from '@/core/executor'
import { logger } from '@/lib/logger'

export type LogExecution = { message: string }

export class LogExecutor<
	TExecution extends LogExecution = LogExecution
> extends Executor<TExecution> {
	execute = async ({ message }: TExecution) => {
		logger.info(message)
	}
}
