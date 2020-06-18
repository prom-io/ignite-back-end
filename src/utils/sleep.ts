export const sleep = (millisecondsToSleep: number): Promise<void> => {
    return new Promise<void>(resolve => {
        setTimeout(resolve, millisecondsToSleep);
    })
};
