import { JsonRpcProvider, WebSocketProvider } from "ethers"

export const getClient = (rpc: string) => {
    if (rpc.startsWith("http")) return new JsonRpcProvider(rpc)

    return new WebSocketProvider(rpc)
}
