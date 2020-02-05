import {TransactionType} from "./TransactionType";
import {FileResponse} from "../../../files/types/response";
import {DataOwnerResponse} from "../../../accounts/types/response";

export interface TransactionResponse {
    dataMart: string,
    sum: number,
    dataOwner: DataOwnerResponse,
    file: FileResponse,
    hash: string,
    createdAt: string,
    type: TransactionType,
    serviceNode: string
}
