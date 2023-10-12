export type AddressLike = `0x${string}`

export type ExtractParams<TEvent extends (...args: any) => any> =
	Parameters<TEvent>[number]

export type UnionToIntersection<T> = (
	T extends any ? (args: T) => any : never
) extends (args: infer U) => any
	? U
	: never
