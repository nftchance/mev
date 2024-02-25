import dotenv from "dotenv"

import { DEFAULT_NETWORKS } from "@/core/engine/constants"
import { Config, Network } from "@/lib/types/config"

dotenv.config()

export const defineConfig = (
    config: Record<keyof typeof DEFAULT_NETWORKS, Network> = DEFAULT_NETWORKS
): Config => config
