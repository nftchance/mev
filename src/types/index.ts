export type Hook<U = {}, T = {}> = (props: {
    enabled?: boolean
    on?: 'block' | 'latest'
    onError?: (error: any) => void
    onSuccess?: (response: any) => void
    config: U
}) => {
    call: () => void
} & Partial<T>

export type Strategy = (props: { onSuccess: (response?: any) => void }) => void

export type StrategyConfiguration = {
    [key: string]: {
        enabled: boolean
        call: Strategy
    }
}
