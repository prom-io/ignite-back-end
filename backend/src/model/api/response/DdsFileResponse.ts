import {ExtendedFileMetadata} from "./ExtendedFileMetadata";

export interface DdsFileResponse {
    id: string,
    attributes: {
        name: string,
        price: number,
        duration: number,
        additional: ExtendedFileMetadata
    }
}
