import {FileMetadata} from "../../../model/entity";

export interface FileResponse {
    id: string,
    createdAt: string,
    keepUntil: string,
    extension: string,
    mimeType: string,
    size: number,
    price: number,
    fileMetadata: FileMetadata
}
