import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {StatusesRepository} from "./StatusesRepository";
import {CreateStatusRequest} from "./types/request";
import {StatusResponse} from "./types/response";
import {StatusesMapper} from "./StatusesMapper";
import {Status, StatusReferenceType} from "./entities";
import {FeedCursors} from "./types/request/FeedCursors";
import {HashTagsRetriever} from "./HashTagsRetriever";
import {Language, User} from "../users/entities";
import {UsersRepository} from "../users/UsersRepository";
import {PaginationRequest} from "../utils/pagination";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {MediaAttachment} from "../media-attachments/entities";
import {asyncMap} from "../utils/async-map";

@Injectable()
export class StatusesService {
    constructor(private readonly statusesRepository: StatusesRepository,
                private readonly usersRepository: UsersRepository,
                private readonly mediaAttachmentRepository: MediaAttachmentsRepository,
                private readonly hashTagsRetriever: HashTagsRetriever,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async createStatus(createStatusRequest: CreateStatusRequest, currentUser: User): Promise<StatusResponse> {
        let mediaAttachments: MediaAttachment[] = [];

        if (createStatusRequest.mediaAttachments && createStatusRequest.mediaAttachments.length) {
            mediaAttachments = await this.mediaAttachmentRepository.findAllByIds(createStatusRequest.mediaAttachments);
        }

        let referredStatus: Status | undefined;

        if (createStatusRequest.referredStatusId) {
            referredStatus = await this.statusesRepository.findById(createStatusRequest.referredStatusId);

            if (!referredStatus) {
                throw new HttpException(
                    `Could not find status with id ${createStatusRequest.referredStatusId}`,
                    HttpStatus.NOT_FOUND
                )
            }
        }

        if (referredStatus && createStatusRequest.statusReferenceType === StatusReferenceType.REPOST && referredStatus.text.length === 0
            && referredStatus.mediaAttachments.length === 0 && referredStatus.referredStatus) {
            referredStatus = referredStatus.referredStatus;
        }

        if (await this.statusesRepository.existByReferredStatusAndReferenceTypeAndAuthor(referredStatus, StatusReferenceType.REPOST, currentUser)) {
            throw new HttpException(
                `Current user has already reposted status with id ${referredStatus.id}`,
                HttpStatus.FORBIDDEN
            );
        }

        const hashTags = await this.hashTagsRetriever.getHashTagsEntitiesFromText(
            createStatusRequest.status,
            (currentUser.preferences && currentUser.preferences.language) ? currentUser.preferences.language : Language.ENGLISH
        );

        let status = this.statusesMapper.fromCreateStatusRequest(
            createStatusRequest,
            currentUser,
            mediaAttachments,
            hashTags,
            referredStatus
        );
        status = await this.statusesRepository.save(status);

        return this.statusesMapper.toStatusResponseAsync(status, currentUser);
    }

    public async findStatusById(id: string, currentUser?: User): Promise<StatusResponse> {
        const status = await this.statusesRepository.findById(id);

        if (!status) {
            throw new HttpException(`Could not find status with id ${id}`, HttpStatus.NOT_FOUND);
        }

        return this.statusesMapper.toStatusResponseAsync(status, currentUser);
    }

    public async findStatusesByUser(
        ethereumAddress: string,
        cursors: FeedCursors,
        currentUser?: User,
    ): Promise<StatusResponse[]> {
        const user = await this.usersRepository.findByEthereumAddress(ethereumAddress);

        if (!user) {
            throw new HttpException(`Could not find user with address ${ethereumAddress}`, HttpStatus.NOT_FOUND);
        }

        const paginationRequest: PaginationRequest = {
            page: 1,
            pageSize: 30
        };
        let statuses: Status[];

        if (cursors.maxId) {
            if (cursors.sinceId) {
                const sinceCursor = await this.findStatusEntityById(cursors.sinceId);
                const maxCursor = await this.findStatusEntityById(cursors.maxId);

                statuses = await this.statusesRepository.findByAuthorAndCreatedAtBetween(
                    user,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    paginationRequest
                );
            } else {
                const maxCursor = await this.findStatusEntityById(cursors.maxId);
                statuses = await this.statusesRepository.findByAuthorAndCreatedAtBefore(user, maxCursor.createdAt, paginationRequest);
            }
        } else if (cursors.sinceId) {
            const sinceCursor = await this.findStatusEntityById(cursors.sinceId);
            statuses = await this.statusesRepository.findByAuthorAndCreatedAtAfter(user, sinceCursor.createdAt, paginationRequest);
        } else {
            statuses = await this.statusesRepository.findByAuthor(user, paginationRequest);
        }

        const statusInfoMap = await this.statusesRepository.getStatusesAdditionalInfoMap(statuses, currentUser);

        return asyncMap(statuses, status => this.statusesMapper.toStatusResponseByStatusInfo(
            status,
            statusInfoMap[status.id],
            status.referredStatus && statusInfoMap[status.referredStatus.id]
        ));
    }

    public async findCommentsOfStatus(statusId: string, cursors: FeedCursors, currentUser?: User): Promise<StatusResponse[]> {
        const status = await this.findStatusEntityById(statusId);

        const paginationRequest: PaginationRequest = {
            page: 1,
            pageSize: 30
        };
        let statuses: Status[];

        if (cursors.maxId) {
            if (cursors.sinceId) {
                const sinceCursor = await this.findStatusEntityById(cursors.sinceId);
                const maxCursor = await this.findStatusEntityById(cursors.maxId);

                statuses = await this.statusesRepository.findByReferredStatusAndStatusReferenceTypeAndCreatedAtBetween(
                    status,
                    StatusReferenceType.COMMENT,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    paginationRequest,
                    "ASC"
                );
            } else {
                const maxCursor = await this.findStatusEntityById(cursors.maxId);
                statuses = await this.statusesRepository.findByReferredStatusAndStatusReferenceTypeAndCreatedAtBefore(
                    status,
                    StatusReferenceType.COMMENT,
                    maxCursor.createdAt,
                    paginationRequest,
                    "ASC"
                );
            }
        } else if (cursors.sinceId) {
            const sinceCursor = await this.findStatusEntityById(cursors.sinceId);
            statuses = await this.statusesRepository.findByReferredStatusAndStatusReferenceTypeAndCreatedAtAfter(
                status,
                StatusReferenceType.COMMENT,
                sinceCursor.createdAt,
                paginationRequest,
                "ASC"
            );
        } else {
            statuses = await this.statusesRepository.findByReferredStatusAndStatusReferenceType(
                status,
                StatusReferenceType.COMMENT,
                paginationRequest,
                "ASC"
            );
        }

        const statusInfoMap = await this.statusesRepository.getStatusesAdditionalInfoMap(statuses, currentUser);

        return asyncMap(
            statuses,
            comment => this.statusesMapper.toStatusResponseByStatusInfo(
                comment,
                statusInfoMap[comment.id],
                comment.referredStatus && statusInfoMap[comment.referredStatus.id]
            )
        );
    }

    private async findStatusEntityById(id: string): Promise<Status> {
        const status = await this.statusesRepository.findById(id);

        if (!status) {
            throw new HttpException(`Could not find status with id ${id}`, HttpStatus.NOT_FOUND);
        }

        return status;
    }
}
