import { Logger, logger } from "../lib/logger";
import errors from "../lib/errors";

export abstract class Executor<TExecution> {
    constructor() {}

    execute = async (execution: TExecution): Promise<void> => {
        throw new Error('Not implemented.')
    }
}