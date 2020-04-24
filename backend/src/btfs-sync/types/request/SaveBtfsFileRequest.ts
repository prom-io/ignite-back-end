import {BaseBtfsRequest} from "./BaseBtfsRequest";

export interface SaveBtfsFileRequest extends BaseBtfsRequest {
    file: {
        buffer: Buffer
    }
}
