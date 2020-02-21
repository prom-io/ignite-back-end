import {Expose} from "class-transformer";
import {UserResponse} from "../../../users/types/response";
import {MediaAttachmentResponse} from "../../../media-attachments/types";

export class StatusResponse {
    id: string;

    @Expose({name: "created_at"})
    createdAt: string;

    account: UserResponse;
    content: string;

    @Expose({name: "favourite_count"})
    favouritesCount: number;
    favourited: boolean;

    @Expose({name: "media_attachments"})
    mediaAttachments: MediaAttachmentResponse[] = [];

    constructor(object: StatusResponse) {
        Object.assign(this, object);
    }
}
