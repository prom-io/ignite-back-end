import {FileInfoResponse} from "./FileInfoResponse";

export interface DataOwnerResponse {
    address: string,
    privateKey: string,
    dataValidatorAddress: string,
    file: FileInfoResponse,
}
