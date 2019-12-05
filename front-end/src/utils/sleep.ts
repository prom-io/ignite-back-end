export const sleep = (millisecondsToSleep: number) => new Promise(resolve => setTimeout(() => resolve(), millisecondsToSleep));
