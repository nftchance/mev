import logger from '../lib/logger'

export const onError = (error: any) => logger.error(error)

export const onStrategySuccess = (response: any) => logger.success(response)
