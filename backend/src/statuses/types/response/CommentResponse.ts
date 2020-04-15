import {Expose} from "class-transformer";
import {MediaAttachmentResponse} from "../../../media-attachments/types";
import {UserResponse} from "../../../users/types/response";

export class CommentResponse {
    id: string;

    text: string;

    @Expose({name: "created_at"})
    createdAt: string;

    @Expose({name: "media_attachments"})
    mediaAttachments: MediaAttachmentResponse[];

    @Expose({name: "status_id"})
    statusId: string;

    author: UserResponse;

    constructor(plainObject: CommentResponse) {
        Object.assign(this, plainObject);
    }
}
