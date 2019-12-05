import {isStringEmpty} from "../../utils";
import {AccountType} from "../../models";

export const validatePrivateKey = (privateKey?: string): string | undefined => {
    if (isStringEmpty(privateKey)) {
        return "Private key is required"
    }
};

export const validateAccountType = (accountType?: string): string | undefined => {
    if (isStringEmpty(accountType)) {
        return "Account type is required"
    }

    if (Object.keys(AccountType).find(key => key === accountType) === undefined) {
        return "Invalid account type"
    }
};
