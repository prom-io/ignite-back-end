import {Expose} from "class-transformer";
import {StatusReferenceType} from "../../entities";
import {UserResponse} from "../../../users/types/response";
import {MediaAttachmentResponse} from "../../../media-attachments/types";
import {BtfsHashResponse} from "../../../btfs-sync/types/response";
import {HashTagResponse} from "./HashTagResponse";

export class StatusResponse {
    id: string;

    @Expose({name: "created_at"})
    createdAt: string;

    account: UserResponse;
    content?: string;

    @Expose({name: "favourite_count"})
    favoritesCount: number;
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

    @Expose({name: "referred_status"})
    referredStatus?: StatusResponse = null;

    @Expose({name: "status_reference_type"})
    statusReferenceType?: StatusReferenceType;

    @Expose({name: "referred_status_id"})
    referredStatusId?: string;

    @Expose({name: "referred_status_reference_type"})
    referredStatusReferenceType?: StatusReferenceType;

    @Expose({name: "reposts_count"})
    repostsCount: number;

    @Expose({name: "btfs_info"})
    btfsInfo?: BtfsHashResponse;

    @Expose({name: "comments_count"})
    commentsCount: number;

    @Expose({name: "can_be_reposted"})
    canBeReposted: boolean;

    reposted: boolean;
    commented: boolean;

    @Expose({name: "hash_tags"})
    hashTags: HashTagResponse[];

    @Expose({name: "is_meme"})
    isMeme: boolean;

    constructor(object: StatusResponse) {
        Object.assign(this, object);
    }
}
