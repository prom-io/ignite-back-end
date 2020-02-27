import {CreateFileMetadataRequest} from "./CreateFileMetadataRequest";

export interface ICreateServiceNodeFileRequest {
    keepUntil: string,
    name: string,
    additional: CreateFileMetadataRequest,
    size: number,
    dataValidatorAddress: string,
    mimeType: string,
    extension: string,
}
