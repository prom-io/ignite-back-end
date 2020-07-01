import {IteratingAsyncCallback} from "./internal/callback-types";

export const asyncForEach = async <T>(array: T[], callback: IteratingAsyncCallback<T>, awaitForCallback: boolean = true): Promise<void> => {
    for (let index = 0; index < array.length; index++) {
        if (awaitForCallback) {
            await callback(array[index], index, array);
        } else {
            callback(array[index], index, array);
        }
    }
};
