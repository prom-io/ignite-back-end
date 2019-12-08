import {FileMetadata} from "./FileMetadata";

export interface UploadDataRequest {
    name: string,
    dataOwnerAddress: string,
    dataValidatorAddress: string,
    additional: FileMetadata,
    keepUntil: Date,
    mimeType: string,
    extension: string,
    size: number
}
