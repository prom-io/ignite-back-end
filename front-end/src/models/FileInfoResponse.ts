import {FileMetadata} from "./FileMetadata";

export interface FileInfoResponse {
    id: string,
    dataValidator: string,
    price: number,
    extension: string,
    mimeType: string,
    size: number,
    name: string,
    metadata: FileMetadata,
    createdAt: string,
    keepUntil: string
}
