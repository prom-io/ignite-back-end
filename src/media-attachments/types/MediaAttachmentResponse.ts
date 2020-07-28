import {Expose} from "class-transformer";

export class MediaAttachmentResponse {
    id: string;
    type: string;
    url: string;
    meta?: {
        width?: number,
        height?: number
    };
    preview128?: MediaAttachmentResponse;
    preview256?: MediaAttachmentResponse;
    preview512?: MediaAttachmentResponse;
    preview1024?: MediaAttachmentResponse;

    constructor(object: MediaAttachmentResponse) {
        Object.assign(this, object);
    }
}
