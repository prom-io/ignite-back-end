import {isStringEmpty} from "../../utils";
import {AccountType} from "../../models";
import Web3 from "web3";

export const validatePrivateKey = (address: string, web3Instance: Web3, privateKey?: string): string | undefined => {
    if (isStringEmpty(privateKey)) {
        return "Private key is required"
    }

    try {
        const addressFromPrivateKey = web3Instance.eth.accounts.privateKeyToAccount(privateKey!).address;

        if (addressFromPrivateKey !== address) {
            return "Invalid private key"
        }
    } catch (error) {
        return "Invalid private key";
    }

    return undefined;
};

export const validateAccountType = (accountType?: string): string | undefined => {
    if (isStringEmpty(accountType)) {
        return "Account type is required"
    }

    if (Object.keys(AccountType).find(key => key === accountType) === undefined) {
        return "Invalid account type"
    }
};
