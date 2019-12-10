export const isStringEmpty = (string?: string): boolean => !Boolean(string && string.trim().length !== 0);

export const shortenString = (string: string, targetLength: number): string => {
    if (string.length < targetLength) {
        return string;
    } else {
        return string.substring(0, targetLength) + "...";
    }
};
