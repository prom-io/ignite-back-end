import {Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {Status, StatusAdditionalInfo, StatusReferenceType,  HashTag} from "./entities";
import {StatusesRepository} from "./StatusesRepository";
import {StatusMappingOptionsProvider} from "./StatusMappingOptionsProvider";
import {StatusResponse} from "./types/response";
import {CreateStatusRequest} from "./types/request";
import {User, UserStatistics} from "../users/entities";
import {UsersMapper} from "../users/UsersMapper";
import {MediaAttachment} from "../media-attachments/entities";
import {MediaAttachmentsMapper} from "../media-attachments/MediaAttachmentsMapper";
import {BtfsHash} from "../btfs-sync/entities";
import {BtfsHashesMapper} from "../btfs-sync/mappers";
import {HashTagsMapper} from "./HashTagsMapper";

export interface ToStatusResponseOptions {
    status: Status,
    favouritesCount: number,
    favourited: boolean,
    userStatistics?: UserStatistics | Omit<UserStatistics, "user">
    followingAuthor: boolean,
    followedByAuthor: boolean,
    mapReferredStatus: boolean,
    referredStatusOptions?: Omit<ToStatusResponseOptions, "mapRepostedStatus" | "repostsCount">,
    repostsCount: number,
    referredStatusId?: string,
    referredStatusReferenceType?: StatusReferenceType,
    btfsHash?: BtfsHash,
    commentsCount: number,
    canBeReposted: boolean
}

@Injectable()
export class StatusesMapper {
    constructor(private readonly userMapper: UsersMapper,
                private readonly mediaAttachmentsMapper: MediaAttachmentsMapper,
                private readonly btfsHashesMapper: BtfsHashesMapper,
                private readonly statusesRepository: StatusesRepository,
                private readonly hashTagsMapper: HashTagsMapper,
                private readonly statusMappingOptionsProvider: StatusMappingOptionsProvider) {
    }

    public async toStatusResponseByStatusInfo(status: Status,
                                              statusInfo: StatusAdditionalInfo,
                                              referredStatusInfo?: StatusAdditionalInfo): Promise<StatusResponse> {
        let referredStatusOptions: ToStatusResponseOptions | undefined;
        const referredStatus = status.referredStatus;

        if (referredStatus && referredStatusInfo) {
            referredStatusOptions = await this.statusMappingOptionsProvider.getStatusMappingOptionsByStatusInfo(
                referredStatus,
                referredStatusInfo,
                undefined
            );
            const statusAncestors = (await this.statusesRepository.findAncestorsOfStatus(referredStatus))
                .filter(ancestor => ancestor.id !== referredStatus.id);

            if (statusAncestors.length !== 0) {
                referredStatusOptions.referredStatusId = statusAncestors[statusAncestors.length - 1].id;
                referredStatusOptions.referredStatusReferenceType = statusAncestors[statusAncestors.length - 1].statusReferenceType;
            }
        }

        const statusMapppingOptions = await this.statusMappingOptionsProvider.getStatusMappingOptionsByStatusInfo(
            status,
            statusInfo,
            referredStatusOptions
        );

        return this.toStatusResponse(statusMapppingOptions);
    }

    public async toStatusResponseAsync(status: Status, currentUser?: User): Promise<StatusResponse> {
        let referredStatusOptions: ToStatusResponseOptions | undefined;
        const referredStatus = status.referredStatus;

        if (referredStatus) {
            referredStatusOptions = await this.statusMappingOptionsProvider.getStatusMappingOptions(
                referredStatus,
                undefined,
                currentUser
            );
            const statusAncestors = (await this.statusesRepository.findAncestorsOfStatus(referredStatus))
                .filter(ancestor => ancestor.id !== referredStatus.id);

            if (statusAncestors.length !== 0) {
                referredStatusOptions.referredStatusId = statusAncestors[statusAncestors.length - 1].id;
                referredStatusOptions.referredStatusReferenceType = statusAncestors[statusAncestors.length - 1].statusReferenceType;
            }
        }

        const statusMappingOptions = await this.statusMappingOptionsProvider.getStatusMappingOptions(
            status,
            referredStatusOptions,
            currentUser
        );

        return this.toStatusResponse(statusMappingOptions);
    }

    public toStatusResponse(options: ToStatusResponseOptions): StatusResponse {
        const {
            status,
            favourited,
            userStatistics,
            followedByAuthor,
            followingAuthor,
            favouritesCount,
            mapReferredStatus,
            referredStatusOptions,
            repostsCount,
            referredStatusId,
            referredStatusReferenceType,
            btfsHash,
            commentsCount,
            canBeReposted
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
            referredStatus: mapReferredStatus ? this.toStatusResponse({
                ...referredStatusOptions,
                mapReferredStatus: false,
                repostsCount: 0
            }) : null,
            repostsCount,
            referredStatusId,
            btfsInfo: btfsHash && this.btfsHashesMapper.toBtfsHashResponse(btfsHash),
            commentsCount,
            statusReferenceType: status.statusReferenceType,
            referredStatusReferenceType,
            canBeReposted,
            hashTags: status.hashTags.map(hashTag => this.hashTagsMapper.toHashTagResponse(hashTag))
        })
    }

    public fromCreateStatusRequest(
        createStatusRequest: CreateStatusRequest,
        author: User,
        mediaAttachments: MediaAttachment[],
        hashTags: HashTag[],
        referredStatus?: Status,
    ): Status {
        return {
            id: uuid(),
            text: createStatusRequest.status || "",
            createdAt: new Date(),
            author,
            updatedAt: null,
            remote: false,
            mediaAttachments,
            referredStatus,
            statusReferenceType: createStatusRequest.statusReferenceType,
            hashTags
        }
    }
}
