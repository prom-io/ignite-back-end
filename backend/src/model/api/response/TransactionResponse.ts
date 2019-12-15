import {FileResponse} from "./FileResponse";
import {DataOwnerResponse} from "./DataOwnerResponse";
import {TransactionType} from "./TransactionType";

export interface TransactionResponse {
    dataMart: string,
    sum: number,
    dataOwner: DataOwnerResponse,
    file: FileResponse,
    hash: string,
    createdAt: string,
    type: TransactionType
}
