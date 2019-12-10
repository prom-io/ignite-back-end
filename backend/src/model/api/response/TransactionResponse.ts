import {FileResponse} from "./FileResponse";
import {DataOwnerResponse} from "./DataOwnerResponse";

export interface TransactionResponse {
    dataMart: string,
    sum: number,
    dataOwner: DataOwnerResponse,
    file: FileResponse,
    hash: string,
    createdAt: string
}
