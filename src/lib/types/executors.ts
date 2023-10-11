import { ExtractParams, UnionToIntersection } from './utils'



export type Executor<
    TAction extends (...args: any) => any = () => {},
    TParams = {},
> = (params: UnionToIntersection<ExtractParams<TAction>> & TParams) => {
    execute: (args: ReturnType<TAction>) => Promise<void>
}
