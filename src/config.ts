import { StrategyConfiguration } from './types'

import { example } from './strategies'

const config = {
    example: {
        enabled: false,
        call: example,
    },
} as StrategyConfiguration

export default config
