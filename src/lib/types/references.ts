import { Network } from "@/lib/types/config"

export type ExplorerResponse = Name & {
    network: Network
} & Partial<{
        abi: string
        source: string
    }>

export type ArtifactResponse = {
    network: Network
} & Partial<{
    address: string
    bytecode: string
    deployedBytecode: string
}>

export type Name = {
    name: string
}

export type StaticReference = Name & {
    network: Network
    abi: string
} & Partial<{
        address: string
        bytecode: string
        deployedBytecode: string
    }>

export type DynamicReference = Name & {
    network: Network
    source: string
}

export type References = Array<
    Name & Omit<ExplorerResponse, "name"> & Partial<ArtifactResponse>
>
