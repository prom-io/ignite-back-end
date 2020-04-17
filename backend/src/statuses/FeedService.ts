import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {StatusesMapper, ToStatusResponseOptions} from "./StatusesMapper";
import {StatusMappingOptionsProvider} from "./StatusMappingOptionsProvider";
import {StatusResponse} from "./types/response";
import {FeedCursors} from "./types/request/FeedCursors";
import {Status} from "./entities";
import {User, UserStatistics} from "../users/entities";
import {PaginationRequest} from "../utils/pagination";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {UserStatisticsRepository} from "../users";
import {asyncMap} from "../utils/async-map";
import {CommentsRepository} from "./CommentsRepository";
import {ToCommentResponseOptions} from "./CommentsMapper";

@Injectable()
export class FeedService {
    constructor(private readonly subscriptionsRepository: UserSubscriptionsRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly userSubscriptionRepository: UserSubscriptionsRepository,
                private readonly commentsRepository: CommentsRepository,
                private readonly statusesMapper: StatusesMapper,
                private readonly statusMappingOptionsProvider: StatusMappingOptionsProvider) {
    }

    public async getFeedOfCurrentUserAfter(currentUser: User, feedCursors: FeedCursors): Promise<StatusResponse[]> {
        const subscriptions = await this.subscriptionsRepository.findAllBySubscribedUser(currentUser);
        const authors = subscriptions.map(subscription => subscription.subscribedTo);
        authors.push(currentUser);

        const paginationRequest: PaginationRequest = {
            page: 1,
            pageSize: 30
        };

        let statuses: Status[];

        if (feedCursors.maxId) {
            if (feedCursors.sinceId) {
                const sinceCursor = await this.statusesRepository.findById(feedCursors.sinceId);
                const maxCursor = await this.statusesRepository.findById(feedCursors.maxId);

                statuses = await this.statusesRepository.findByAuthorInAndCreatedAtBetween(
                    authors,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    paginationRequest
                );
            } else {
                const maxCursor = await this.statusesRepository.findById(feedCursors.maxId);
                statuses = await this.statusesRepository.findByAuthorInAndCreatedAtBefore(authors, maxCursor.createdAt, paginationRequest);
            }
        } else if (feedCursors.sinceId) {
            const sinceCursor = await this.statusesRepository.findById(feedCursors.sinceId);
            statuses = await this.statusesRepository.findByAuthorInAndCreatedAfter(authors, sinceCursor.createdAt, paginationRequest);
        } else {
            statuses = await this.statusesRepository.findByAuthorIn(authors, paginationRequest);
        }

        return this.mapStatusesToStatusesResponse(statuses, currentUser)
    }

    public async getGlobalFeed(feedCursors: FeedCursors, currentUser?: User): Promise<StatusResponse[]> {
        const paginationRequest: PaginationRequest = {
            page: 1,
            pageSize: 30
        };

        let statuses: Status[];

        if (feedCursors.maxId) {
            if (feedCursors.sinceId) {
                const sinceCursor = await this.findStatusById(feedCursors.sinceId);
                const maxCursor = await this.findStatusById(feedCursors.maxId);

                statuses = await this.statusesRepository.findByCreatedAtBetween(
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    paginationRequest
                );
            } else {
                const maxCursor = await this.findStatusById(feedCursors.maxId);
                statuses = await this.statusesRepository.findByCreatedAtBefore(maxCursor.createdAt, paginationRequest);
            }
        } else if (feedCursors.sinceId) {
            const sinceCursor = await this.findStatusById(feedCursors.sinceId);
            statuses = await this.statusesRepository.findByCreatedAtAfter(sinceCursor.createdAt, paginationRequest);
        } else {
            statuses = await this.statusesRepository.findAllBy(paginationRequest);
        }

        return this.mapStatusesToStatusesResponse(statuses, currentUser);
    }

    private async mapStatusesToStatusesResponse(statuses: Status[], currentUser?: User): Promise<StatusResponse[]> {
        return asyncMap(statuses, async status => {
            let repostedStatusOptions: ToStatusResponseOptions | undefined;
            let repostedCommentOptions: ToCommentResponseOptions | undefined;
            const repostedStatus = status.repostedStatus;
            const repostedComment = status.repostedComment;

            if (repostedStatus) {
                repostedStatusOptions = await this.statusMappingOptionsProvider.getStatusMappingOptions(
                    repostedStatus,
                    undefined,
                    currentUser
                );
                const statusAncestors = (await this.statusesRepository.findAncestorsOfStatus(repostedStatus))
                    .map(ancestor => ancestor.id)
                    .filter(ancestorId => ancestorId !== repostedStatus.id);
                repostedStatusOptions.repostedStatusId = statusAncestors[statusAncestors.length - 1];
            }

            if (repostedComment) {
                repostedCommentOptions = {
                    comment: repostedComment,
                    repostsCount: await this.statusesRepository.countByRepostedComment(repostedComment)
                }
            }

            const statusMappingOptions = await this.statusMappingOptionsProvider.getStatusMappingOptions(
                status,
                repostedStatusOptions,
                currentUser
            );

            return this.statusesMapper.toStatusResponse(statusMappingOptions);
        })
    }

    private async findStatusById(id: string): Promise<Status> {
        const status = await this.statusesRepository.findById(id);

        if (!status) {
            throw new HttpException(`Could not find status with id ${id}`, HttpStatus.NOT_FOUND);
        }

        return status;
    }
}
