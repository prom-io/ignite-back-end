import {Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {Status} from "./entities";
import {StatusResponse} from "./types/response";
import {CreateStatusRequest} from "./types/request";
import {User, UserStatistics} from "../users/entities";
import {UsersMapper} from "../users/UsersMapper";
import {MediaAttachment} from "../media-attachments/entities";
import {MediaAttachmentsMapper} from "../media-attachments/MediaAttachmentsMapper";
import {BtfsHash} from "../btfs-sync/entities";
import {BtfsHashesMapper} from "../btfs-sync/mappers";

export interface ToStatusResponseOptions {
    status: Status,
    favouritesCount: number,
    favourited: boolean,
    userStatistics?: UserStatistics,
    followingAuthor: boolean,
    followedByAuthor: boolean,
    mapRepostedStatus: boolean,
    repostedStatusOptions?: Omit<ToStatusResponseOptions, "mapRepostedStatus" | "repostsCount">,
    repostsCount: number,
    repostedStatusId?: string,
    btfsHash?: BtfsHash
}

@Injectable()
export class StatusesMapper {
    constructor(private readonly userMapper: UsersMapper,
                private readonly mediaAttachmentsMapper: MediaAttachmentsMapper,
                private readonly btfsHashesMapper: BtfsHashesMapper) {
    }

    public toStatusResponse(options: ToStatusResponseOptions): StatusResponse {
        const {
            status,
            favourited,
            userStatistics,
            followedByAuthor,
            followingAuthor,
            favouritesCount,
            mapRepostedStatus,
            repostedStatusOptions,
            repostsCount,
            repostedStatusId,
            btfsHash
        } = options;
        return new StatusResponse({
            account: this.userMapper.toUserResponse(status.author, userStatistics, followingAuthor, followedByAuthor),
            createdAt: status.createdAt.toISOString(),
            id: status.id,
            favouritesCount,
            favourited,
            content: status.text,
            mediaAttachments: status.mediaAttachments.map(mediaAttachment => this.mediaAttachmentsMapper.toMediaAttachmentResponse(mediaAttachment)),
            emojis: [],
            fields: [],
            tags: [],
            visibility: "public",
            spoilerText: "",
            revisedAt: null,
            respostedStatus: mapRepostedStatus ? this.toStatusResponse({
                ...repostedStatusOptions,
                mapRepostedStatus: false,
                repostsCount: 0
            }) : null,
            repostsCount,
            repostedStatusId,
            btfsInfo: btfsHash && this.btfsHashesMapper.toBtfsHashResponse(btfsHash)
        })
    }

    public fromCreateStatusRequest(
        createStatusRequest: CreateStatusRequest,
        author: User,
        mediaAttachments: MediaAttachment[],
        repostedStatus?: Status
    ): Status {
        return  {
            id: uuid(),
            text: createStatusRequest.status || "",
            createdAt: new Date(),
            author,
            updatedAt: null,
            remote: false,
            mediaAttachments,
            repostedStatus
        }
    }
}
