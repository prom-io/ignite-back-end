import {Expose} from "class-transformer";

export class MediaAttachmentResponse {
    id: string;
    type: string;
    url: string;
    meta?: {
        width?: number,
        height?: number
    };

    constructor(object: MediaAttachmentResponse) {
        Object.assign(this, object);
    }
}
