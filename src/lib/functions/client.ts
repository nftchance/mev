import { providers } from "ethers"

export const getClient = (rpc: string) => {
    if (rpc.startsWith("http")) return new providers.JsonRpcProvider(rpc)

    return new providers.WebSocketProvider(rpc)
}
