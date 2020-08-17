import {Expose} from "class-transformer";
import {StatusReferenceType} from "../../entities";
import {UserResponse} from "../../../users/types/response";
import {MediaAttachmentResponse} from "../../../media-attachments/types";
import {BtfsHashResponse} from "../../../btfs-sync/types/response";
import {HashTagResponse} from "./HashTagResponse";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class StatusResponse {
    @ApiProperty({type: 'string'})
    id: string;

    @ApiProperty({type: 'string'})
    @Expose({name: "created_at"})
    createdAt: string;

    @ApiProperty({type: () => UserResponse})
    account: UserResponse;

    @ApiPropertyOptional({type: 'string'})
    content?: string;

    @ApiProperty({type: 'int'})
    @Expose({name: "favourite_count"})
    favoritesCount: number;

    @ApiProperty({type: 'boolean'})
    favourited: boolean; 

    @ApiProperty({type: () => MediaAttachmentResponse, isArray: true})
    @Expose({name: "media_attachments"})
    mediaAttachments: MediaAttachmentResponse[] = [];

    @ApiProperty({type: 'string', isArray: true})
    emojis: string[] = [];

    @ApiProperty({type: 'string', isArray: true})
    tags: string[] = [];

    @ApiProperty({type: 'string', isArray: true})
    fields: string[] = [];

    @ApiProperty({type: 'string'})
    visibility: string = "public";

    @ApiProperty({type: 'string'})
    @Expose({name: "spoiler_text"})
    spoilerText: string = "";

    @ApiProperty({type: 'string'})
    @Expose({name: "revised_at"})
    revisedAt: string | null = null;

    @ApiPropertyOptional({type: () => StatusResponse})
    @Expose({name: "referred_status"})
    referredStatus?: StatusResponse = null;

    @ApiPropertyOptional({enum: StatusReferenceType })
    @Expose({name: "status_reference_type"})
    statusReferenceType?: StatusReferenceType;

    @ApiPropertyOptional({type: 'string'})
    @Expose({name: "referred_status_id"})
    referredStatusId?: string;

    @ApiPropertyOptional({enum: StatusReferenceType })
    @Expose({name: "referred_status_reference_type"})
    referredStatusReferenceType?: StatusReferenceType;

    @ApiProperty({type: 'int'})
    @Expose({name: "reposts_count"})
    repostsCount: number;

    @ApiPropertyOptional({type: () => BtfsHashResponse})
    @Expose({name: "btfs_info"})
    btfsInfo?: BtfsHashResponse;

    @ApiProperty({type: 'int'})
    @Expose({name: "comments_count"})
    commentsCount: number;

    @ApiProperty({type: 'boolean'})
    @Expose({name: "can_be_reposted"})
    canBeReposted: boolean;

    @ApiProperty({type: 'boolean'})
    reposted: boolean;

    @ApiProperty({type: 'boolean'})
    commented: boolean;

    @ApiProperty({type: () => HashTagResponse, isArray: true})
    @Expose({name: "hash_tags"})
    hashTags: HashTagResponse[];

    @ApiProperty({type: 'boolean'})
    @Expose({name: "is_meme"})
    isMeme: boolean;

    constructor(object: StatusResponse) {
        Object.assign(this, object);
    }
}
