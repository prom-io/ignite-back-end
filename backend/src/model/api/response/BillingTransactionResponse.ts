import {TransactionType} from "./TransactionType";

export interface BillingTransactionResponse {
    id: string,
    hash: string,
    value: number,
    from: string,
    to: string,
    status: boolean,
    serviceNode: string,
    type: TransactionType,
    createdAt: string
}
