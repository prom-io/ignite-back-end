export type IteratingAsyncCallback<T> = (element: T, index: number, array: T[]) => Promise<void>

export type IteratingAsyncMappingCallback<S, T> = (element: S, index: number, array: S[]) => Promise<T>;
