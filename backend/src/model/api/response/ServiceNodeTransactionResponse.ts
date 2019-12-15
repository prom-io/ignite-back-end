import {TransactionType} from "./TransactionType";

export interface ServiceNodeTransactionResponse {
    id: string,
    hash: string,
    value: number,
    dataValidator: string,
    dataMart: string,
    dataOwner: string,
    blockNumber: number,
    queueNumber: number,
    status: boolean,
    serviceNode: string,
    type: TransactionType,
    created_at: string
}
