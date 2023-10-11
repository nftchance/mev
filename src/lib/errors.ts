export default { 
    Collector: { 
        NewBlock: { 
            FailedRetrievingHash: (err: unknown) => `Failed retrieving hash for block: ${err}`,
            SuccessPublishingBlock: (msg: unknown | undefined) => `Published block${msg ? `: ${msg}` : ''}`,
            FailedPublishingBlock: (err: unknown) => `Error publishing block: ${err}`,
        },
        OpenseaOrder: { 
            SuccessPublishingOrder: (msg: unknown | undefined) => `Published order${msg ? `: ${msg}` : ''}`,
            FailedPublishingOrder: (err: unknown) => `Error publishing order: ${err}`,
        }
    }
} as const