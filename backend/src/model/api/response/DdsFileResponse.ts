import {FileMetadata} from "../../entity";

export interface DdsFileResponse {
    id: string,
    attributes: {
        name: string,
        price: number,
        duration: number,
        additional: FileMetadata
    }
}
