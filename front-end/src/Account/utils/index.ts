import {makePreciseNumberString} from "../../utils";

export const getBalanceLabel = (balance?: number, currency: string = "PROM") => {
    if (balance !== undefined && balance !== null) {
        return `Balance: ${makePreciseNumberString(balance)} ${currency}`;
    } else {
        return `Balance: 0 ${currency}`;
    }
};
