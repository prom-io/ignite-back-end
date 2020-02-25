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

    emojis: string[] = [];
    tags: string[] = [];
    fields: string[] = [];
    visibility: string = "public";

    @Expose({name: "spoiler_text"})
    spoilerText: string = "";

    @Expose({name: "revised_at"})
    revisedAt: string | null = null;

    constructor(object: StatusResponse) {
        Object.assign(this, object);
    }
}