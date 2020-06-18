import {IteratingAsyncMappingCallback} from "./internal/callback-types";

export const asyncMap = async <S, T>(array: S[], callback: IteratingAsyncMappingCallback<S, T>): Promise<T[]> => {
    const result: T[] = [];

    for (let index = 0; index < array.length; index++) {
        const resultItem = await callback(array[index], index, array);
        result.push(resultItem);
    }

    return result;
};
