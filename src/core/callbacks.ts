import { logger } from "../lib/logger";

export const onError = (error: string) => logger.error(error);

export const onStrategySuccess = (response: string) => logger.success(response);
