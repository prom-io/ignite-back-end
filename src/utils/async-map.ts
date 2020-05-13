import {IteratingAsyncMappingCallback} from "./internal/callback-types";

export const asyncMap = async <S, T>(array: S[], callback: IteratingAsyncMappingCallback<S, T>): Promise<T[]> => {
    return Promise.all(
        array.map(async (item, index, sourceArray) => await callback(item, index, sourceArray))
    )
};
