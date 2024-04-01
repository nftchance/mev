import { Network } from "@/lib/types/config"

export type AdditionalSources = Array<{
    Filename: string
    SourceCode: string
}>

export type ExplorerResponse = Name & {
    network: Network
    additionalSources: AdditionalSources
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
    additionalSources: AdditionalSources
}

export type References = Array<
    Name &
        Omit<ExplorerResponse, "name" | "additionalSources"> &
        Partial<ArtifactResponse> &
        Partial<{ additionalSources: AdditionalSources }>
>
