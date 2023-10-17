export abstract class Executor<TExecution> {
	execute = async (execution: TExecution): Promise<void> => {
		throw new Error('Not implemented.')
	}
}
