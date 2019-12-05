import {FileMetadata} from "../../entity";

export interface ICreateServiceNodeFileRequest {
    keepUntil: string,
    name: string,
    additional: FileMetadata,
    dataOwnerAddress: string,
    size: number,
    dataValidatorAddress: string,
    serviceNodeAddress?: string
}
