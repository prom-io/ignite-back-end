import {TransactionType} from "./TransactionType";

export interface BillingTransactionResponse {
    id: string,
    uuid: string,
    hash: string,
    txType: TransactionType,
    from: string,
    to: string,
    serviceNode: string,
    value: string,
    status: boolean,
    sum: number
}
