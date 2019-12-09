import {FileResponse} from "./FileResponse";

export interface DataOwnerResponse {
    address: string,
    privateKey: string,
    dataValidatorAddress: string,
    file: FileResponse
}
