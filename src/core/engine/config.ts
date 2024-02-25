import dotenv from "dotenv"

import { DEFAULT_NETWORKS } from "@/core/engine/constants"
import { Config } from "@/lib/types/config"

dotenv.config()

/// NOTE: With the newer architecture this function is not really used
///       for anything, but to prevent the future need for another
///       major breaking change it remains here and will enable
///       the ability to manipulate the state of the config object when
///       needed or when passed to the Engine.
export const defineConfig = (config: Config = DEFAULT_NETWORKS) => config
