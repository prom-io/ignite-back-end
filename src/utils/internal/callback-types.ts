export type IteratingCallback<T> = (element: T, index: number, array: T[]) => void

export type IteratingAsyncMappingCallback<S, T> = (element: S, index: number, array: S[]) => Promise<T>;
