import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {StatusesRepository} from "./StatusesRepository";
import {CreateStatusRequest} from "./types/request";
import {StatusResponse} from "./types/response";
import {StatusesMapper, ToStatusResponseOptions} from "./StatusesMapper";
import {StatusMappingOptionsProvider} from "./StatusMappingOptionsProvider";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {User} from "../users/entities";
import {UsersRepository} from "../users/UsersRepository";
import {PaginationRequest} from "../utils/pagination";
import {Status} from "./entities";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {MediaAttachment} from "../media-attachments/entities";
import {FeedCursors} from "./types/request/FeedCursors";
import {UserStatisticsRepository} from "../users/UserStatisticsRepository";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {asyncMap} from "../utils/async-map";

@Injectable()
export class StatusesService {
    constructor(private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly usersRepository: UsersRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly userSubscriptionRepository: UserSubscriptionsRepository,
                private readonly mediaAttachmentRepository: MediaAttachmentsRepository,
                private readonly statusesMapper: StatusesMapper,
                private readonly statusMappingOptionsProvider: StatusMappingOptionsProvider) {
    }

    public async createStatus(createStatusRequest: CreateStatusRequest, currentUser: User): Promise<StatusResponse> {
        let mediaAttachments: MediaAttachment[] = [];

        if (createStatusRequest.media_attachments && createStatusRequest.media_attachments.length) {
            mediaAttachments = await this.mediaAttachmentRepository.findAllByIds(createStatusRequest.media_attachments);
        }

        let repostedStatus: Status | undefined;

        if (createStatusRequest.repostedStatusId) {
            repostedStatus = await this.statusesRepository.findById(createStatusRequest.repostedStatusId);

            if (!repostedStatus) {
                throw new HttpException(
                    `Could not find status with id ${createStatusRequest.repostedStatusId}`,
                    HttpStatus.NOT_FOUND
                )
            }
        }

        let status = this.statusesMapper.fromCreateStatusRequest(
            createStatusRequest,
            currentUser,
            mediaAttachments,
            repostedStatus
        );
        status = await this.statusesRepository.save(status);
        let repostedStatusMappingOptions: ToStatusResponseOptions | undefined;

        if (status.repostedStatus) {
            repostedStatusMappingOptions = await this.statusMappingOptionsProvider.getStatusMappingOptions(
                repostedStatus,
                undefined,
                currentUser
            );
            const statusAncestors = (await this.statusesRepository.findAncestorsOfStatus(repostedStatus))
                .map(ancestor => ancestor.id)
                .filter(ancestorId => ancestorId !== repostedStatus.id);
            repostedStatusMappingOptions.repostedStatusId = statusAncestors[statusAncestors.length - 1];
        }

        const statusMappingOptions = await this.statusMappingOptionsProvider.getStatusMappingOptions(
            status,
            repostedStatusMappingOptions,
            currentUser
        );

        return this.statusesMapper.toStatusResponse(statusMappingOptions);
    }

    public async findStatusById(id: string, currentUser?: User): Promise<StatusResponse> {
        const status = await this.statusesRepository.findById(id);

        if (!status) {
            throw new HttpException(`Could not find status with id ${id}`, HttpStatus.NOT_FOUND);
        }

        let repostedStatusOptions: ToStatusResponseOptions | undefined;
        const repostedStatus = status.repostedStatus;

        if (repostedStatus) {
            repostedStatusOptions = await this.statusMappingOptionsProvider.getStatusMappingOptions(
                repostedStatus,
                undefined,
                currentUser
            );
            let statusAncestors = (await this.statusesRepository.findAncestorsOfStatus(repostedStatus))
                .map(ancestor => ancestor.id)
                .filter(ancestorId => ancestorId !== repostedStatus.id);
            statusAncestors = statusAncestors.filter(ancestorId => ancestorId !== repostedStatus.id);
            repostedStatusOptions.repostedStatusId = statusAncestors[statusAncestors.length - 1];
        }

        const statusMappingOptions = await this.statusMappingOptionsProvider.getStatusMappingOptions(
            status,
            repostedStatusOptions,
            currentUser
        );

        return this.statusesMapper.toStatusResponse(statusMappingOptions);
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
                const maxCursor = await  this.findStatusEntityById(cursors.maxId);
                statuses = await this.statusesRepository.findByAuthorAndCreatedAtBefore(user, maxCursor.createdAt, paginationRequest);
            }
        } else if (cursors.sinceId) {
            const sinceCursor = await this.findStatusEntityById(cursors.sinceId);
            statuses = await this.statusesRepository.findByAuthorAndCreatedAtAfter(user, sinceCursor.createdAt, paginationRequest);
        } else {
            statuses = await this.statusesRepository.findByAuthor(user, paginationRequest);
        }

        return asyncMap(statuses, async status => {
            let repostedStatusOptions: ToStatusResponseOptions | undefined;
            const repostedStatus = status.repostedStatus;

            if (repostedStatus) {
                repostedStatusOptions = await this.statusMappingOptionsProvider.getStatusMappingOptions(
                    repostedStatus,
                    undefined,
                    currentUser
                );
                const statusAncestors = (await this.statusesRepository.findAncestorsOfStatus(repostedStatus))
                    .map(ancestor => ancestor.id)
                    .filter(ancestorId => ancestorId !== repostedStatus.id);;
                repostedStatusOptions.repostedStatusId = statusAncestors[statusAncestors.length - 1];
            }

            const statusMappingOptions = await this.statusMappingOptionsProvider.getStatusMappingOptions(
                status,
                repostedStatusOptions,
                currentUser
            );
            return this.statusesMapper.toStatusResponse(statusMappingOptions);
        })
    }

    private async findStatusEntityById(id: string): Promise<Status> {
        const status = await this.statusesRepository.findById(id);

        if (!status) {
            throw new HttpException(`Could not find status with id ${id}`, HttpStatus.NOT_FOUND);
        }

        return status;
    }
}
