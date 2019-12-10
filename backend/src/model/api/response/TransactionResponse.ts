import {FileResponse} from "./FileResponse";

export interface TransactionResponse {
    dataMart: string,
    sum: number,
    dataOwner: string,
    file: FileResponse,
    hash: string
}
