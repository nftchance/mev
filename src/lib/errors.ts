export default {
	Collector: {
		NewBlock: {
			FailedRetrievingHash: (err: unknown) =>
				`Failed retrieving hash for block: ${err}`,
			SuccessPublishing: (msg: unknown | undefined) =>
				`Published block${msg ? `: ${msg}` : ''}`,
			FailedPublishing: (err: unknown) => `Error publishing block: ${err}`
		},
		OpenseaListing: {
			SuccessPublishing: (msg: unknown | undefined) =>
				`Published listing${msg ? `: ${msg}` : ''}`,
			FailedPublishing: (err: unknown) =>
				`Error publishing listing: ${err}`
		}
	}
} as const
