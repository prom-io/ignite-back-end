type CallbackFunction<T> = (element: T, index: number, array: T[]) => void

export const asyncForEach = async <T>(array: T[], callback: CallbackFunction<T>): Promise<void> => {
    for (let index = 0; index < array.length; index++) {
        callback(array[index], index, array);
    }
};
