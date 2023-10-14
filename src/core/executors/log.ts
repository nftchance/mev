import { Executor } from '@/core/executor'
import { logger } from '@/lib/logger'

export class LogExecutor<
	TExecution extends { message: string } = { message: string }
> extends Executor<TExecution> {
	execute = async ({ message }: TExecution) => {
		logger.info(message)
	}
}
