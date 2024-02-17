import axios from "axios"

import { Executor } from "@/core/executor"
import { logger } from "@/lib/logger"

const key = "Discord"

export type DiscordExecution = {
    webhookUrl: string
    data: {
        embeds: Array<Record<string, any>>
    }
}

export class DiscordExecutor<
    TExecution extends DiscordExecution = DiscordExecution,
> extends Executor<typeof key, TExecution> {
    constructor() {
        super(key)
    }

    execute = async ({ webhookUrl, data }: TExecution) => {
        axios
            .post(webhookUrl, data, {
                headers: { "Content-Type": "application/json" },
            })
            .then(() => {
                logger.info(`Discord message sent to ${webhookUrl}`)
            })
            .catch((error) => {
                logger.error(
                    `Discord message failed to send to ${webhookUrl}: ${error}`,
                )
            })
    }
}
