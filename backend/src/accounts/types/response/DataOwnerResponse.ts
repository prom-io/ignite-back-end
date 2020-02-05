import {FileResponse} from "../../../files/types/response/FileResponse";

export interface DataOwnerResponse {
    address: string,
    privateKey: string,
    dataValidatorAddress: string,
    file: FileResponse
}
