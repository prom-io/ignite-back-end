import {TransactionResponse} from "./TransactionResponse";
import {Normalized} from "../utils";

export interface TransactionsByAddresses {
    [dataValidatorAddress: string]: {
        pagination: {page: number},
        transactions: TransactionResponse[],
        pending: boolean
    }
}
