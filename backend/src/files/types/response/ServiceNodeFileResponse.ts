import {FileMetadata} from "../entity";

export interface ServiceNodeFileResponse {
    id: string,
    name: string,
    extension: string,
    mimeType: string,
    size: number,
    metadata: FileMetadata,
    deletedLocally: boolean
}
