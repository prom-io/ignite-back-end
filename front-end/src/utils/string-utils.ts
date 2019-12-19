const prettyNumber = require("pretty-num").default;
const {PRECISION_SETTING} = require("pretty-num");

export const isStringEmpty = (string?: string): boolean => !Boolean(string && string.trim().length !== 0);

export const shortenString = (string: string, targetLength: number): string => {
    if (string.length < targetLength) {
        return string;
    } else {
        return string.substring(0, targetLength) + "...";
    }
};

export const makePreciseNumberString = (number: number, precision: number | undefined = 8, removeTrailingZeros: boolean | undefined = false): string => {
    if (removeTrailingZeros) {
        return prettyNumber(number, {precision});
    } else {
        return prettyNumber(number, {
            precision,
            precisionSetting: PRECISION_SETTING.FIXED
        })
    }
};
