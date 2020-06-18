export const isDebug = (loggingLevel: string) => {
    return loggingLevel.trim() === "DEBUG" || loggingLevel.trim() === "debug";
};
