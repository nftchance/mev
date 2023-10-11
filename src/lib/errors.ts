export default { 
    Collector: { 
        NewBlock: { 
            FailedRetrievingHash: (err: unknown) => `Failed retrieving hash for block: ${err}`,
            SuccessPublishing: (msg: unknown | undefined) => `Published block${msg ? `: ${msg}` : ''}`,
            FailedPublishing: (err: unknown) => `Error publishing block: ${err}`,
        },
        OpenseaOrder: { 
            SuccessPublishing: (msg: unknown | undefined) => `Published order${msg ? `: ${msg}` : ''}`,
            FailedPublishing: (err: unknown) => `Error publishing order: ${err}`,
        }
    }
} as const