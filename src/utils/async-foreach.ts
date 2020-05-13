import {IteratingCallback} from "./internal/callback-types";

export const asyncForEach = async <T>(array: T[], callback: IteratingCallback<T>): Promise<void> => {
    for (let index = 0; index < array.length; index++) {
        callback(array[index], index, array);
    }
};
