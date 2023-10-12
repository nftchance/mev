export class Strategy<TCollections, TExecutions> {
	syncState = async () => {}

	processCollection = async (
		collection: TCollections
	): Promise<TExecutions | void> => {
		throw new Error('Not implemented.')
	}
}
