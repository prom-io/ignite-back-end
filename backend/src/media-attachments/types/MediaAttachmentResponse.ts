import {Expose} from "class-transformer";

export class MediaAttachmentResponse {
    id: string;
    type: string;
    url: string;

    @Expose({name: "preview_url"})
    previewUrl: string;

    meta: {
        original: {
            width: number,
            height: number
        },
        small: {
            width: number,
            height: number
        }
    };
}
