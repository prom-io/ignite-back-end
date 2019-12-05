import {isStringEmpty} from "./string-utils";

const ETHEREUM_ADDRESS_REGEXP = new RegExp("^0x[a-fA-F0-9]{40}$");

export const validateEthereumAddress = (address: string | undefined, acceptEmpty: boolean = false): string | undefined => {
    if (isStringEmpty(address) && !acceptEmpty) {
        return "Address must be specified";
    }

    if (!ETHEREUM_ADDRESS_REGEXP.test(address!)) {
        return "Invalid ethereum address";
    }
};
