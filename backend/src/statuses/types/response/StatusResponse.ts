import {Expose} from "class-transformer";
import {UserResponse} from "../../../users/types/response";
import {MediaAttachmentResponse} from "../../../media-attachments/types";
import {BtfsHashResponse} from "../../../btfs-sync/types/response";

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

    @Expose({name: "reposted_status"})
    respostedStatus?: StatusResponse = null;

    @Expose({name: "reposted_status_id"})
    repostedStatusId?: string;

    @Expose({name: "reposts_count"})
    repostsCount: number;

    @Expose({name: "btfs_info"})
    btfsInfo?: BtfsHashResponse;

    constructor(object: StatusResponse) {
        Object.assign(this, object);
    }
}
