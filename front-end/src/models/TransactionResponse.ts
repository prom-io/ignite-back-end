import {DataOwnerResponse} from "./DataOwnerResponse";
import {FileInfoResponse} from "./FileInfoResponse";

export interface TransactionResponse {
    dataMart: string,
    sum: number,
    dataOwner: DataOwnerResponse,
    file: FileInfoResponse,
    hash: string,
    createdAt: string,
    type: "dataUpload" | "dataPurchase"
}
