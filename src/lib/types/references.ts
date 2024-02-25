export type Name = {
    name: string
}

export type StaticReference = Name & {
    rpc: string
    abi: string
    address?: string
    bytecode?: string
    deployedBytecode?: string
}

export type DynamicReference = Name & {
    source: string
}

export type References = Array<
    Name &
        Partial<{
            address: string
            abi: string
            bytecode: string
            deployedBytecode: string
            source: string
        }>
>
