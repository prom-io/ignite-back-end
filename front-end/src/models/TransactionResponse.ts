import {TransactionType} from "./TransactionType";

export interface TransactionResponse {
    id: string,
    value: number,
    from: string,
    to: string,
    serviceNode: string,
    type: TransactionType,
    status: boolean,
    hash: string
}
