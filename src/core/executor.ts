import { Abstract } from "@/core/abstract"

export abstract class Executor<
    TKey extends string,
    TExecution,
> extends Abstract<`${TKey}Execution`> {
    constructor(key: TKey) {
        super(`${key}Execution`)
    }

    abstract execute: (execution: TExecution) => Promise<void>
}
