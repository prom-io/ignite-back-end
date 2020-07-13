import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {HashTagSubscriptionsRepository} from "./HashTagSubscriptionsRepository";
import {StatusesMapper} from "./StatusesMapper";
import {StatusResponse} from "./types/response";
import {FeedCursors} from "./types/request";
import {Status, StatusInfoMap} from "./entities";
import {getLanguageFromString, Language, User} from "../users/entities";
import {PaginationRequest} from "../utils/pagination";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {UsersRepository, UserStatisticsRepository} from "../users";
import {asyncMap} from "../utils/async-map";
import {config} from "../config";
import {isAdmin} from "../utils/is-admin";

@Injectable()
export class FeedService {
    constructor(private readonly subscriptionsRepository: UserSubscriptionsRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly usersRepository: UsersRepository,
                private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly userSubscriptionRepository: UserSubscriptionsRepository,
                private readonly hashTagSubscriptionsRepository: HashTagSubscriptionsRepository,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async getFeedOfCurrentUserAfter(currentUser: User, feedCursors: FeedCursors): Promise<StatusResponse[]> {
        if (isAdmin(currentUser)) {
            return this.getGlobalFeed(feedCursors, currentUser);
        }

        const subscriptions = await this.subscriptionsRepository.findAllBySubscribedUserNotReverted(currentUser);
        const authors = subscriptions.map(subscription => subscription.subscribedTo);
        authors.push(currentUser);

        const hashTags = (await this.hashTagSubscriptionsRepository.findByUserAndNotReverted(currentUser))
            .map(hashTagSubscription => hashTagSubscription.hashTag);

        const paginationRequest: PaginationRequest = {
            page: 1,
            pageSize: 30
        };

        let statuses: Status[];

        if (feedCursors.maxId) {
            if (feedCursors.sinceId) {
                const sinceCursor = await this.statusesRepository.findById(feedCursors.sinceId);
                const maxCursor = await this.statusesRepository.findById(feedCursors.maxId);

                statuses = await this.statusesRepository.findByAuthorInAndHashTagsInAndCreatedAtBetween(
                    authors,
                    hashTags,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    paginationRequest
                );
            } else {
                const maxCursor = await this.statusesRepository.findById(feedCursors.maxId);
                statuses = await this.statusesRepository.findByAuthorInAndHashTagsInAndCreatedAtBefore(
                    authors,
                    hashTags,
                    maxCursor.createdAt,
                    paginationRequest
                );
            }
        } else if (feedCursors.sinceId) {
            const sinceCursor = await this.statusesRepository.findById(feedCursors.sinceId);
            statuses = await this.statusesRepository.findByAuthorInAndHashTagsInAndCreatedAtAfter(
                authors,
                hashTags,
                sinceCursor.createdAt,
                paginationRequest
            );
        } else {
            statuses = await this.statusesRepository.findByAuthorInAndHashTagsIn(authors, hashTags, paginationRequest);
        }

        const statusInfoMap = await this.statusesRepository.getStatusesAdditionalInfoMap(statuses, currentUser);

        return this.mapStatusesToStatusesResponseByStatusInfo(statuses, statusInfoMap);
    }

    public async getGlobalFeed(feedCursors: FeedCursors, currentUser?: User, language?: string): Promise<StatusResponse[]> {
        language = getLanguageFromString(language);

        const paginationRequest: PaginationRequest = {
            page: 1,
            pageSize: 30
        };

        let statuses: Status[];
        let displayedUsers: User[] = [];

        if (!isAdmin(currentUser)
            && config.ENABLE_GLOBAL_TIMELINE_FILTERING && config.KOREAN_FILTERING_USER_ADDRESS && config.ENGLISH_FILTERING_USER_ADDRESS) {
            let filteringUser: User;

            if (language === "ko") {
                filteringUser = await this.usersRepository.findByEthereumAddress(config.KOREAN_FILTERING_USER_ADDRESS);
            } else {
                filteringUser = await this.usersRepository.findByEthereumAddress(config.ENGLISH_FILTERING_USER_ADDRESS);
            }

            if (filteringUser) {
                displayedUsers = (await this.userSubscriptionRepository.findAllBySubscribedUserNotReverted(filteringUser))
                    .map(subscription => subscription.subscribedTo);
            }

            if (currentUser) {
                displayedUsers.push(currentUser);
            }
        }

        const shouldFilterUsers = displayedUsers.length !== 0;

        if (feedCursors.maxId) {
            if (feedCursors.sinceId) {
                const sinceCursor = await this.findStatusById(feedCursors.sinceId);
                const maxCursor = await this.findStatusById(feedCursors.maxId);

                if (shouldFilterUsers) {
                    statuses = await this.statusesRepository.findByAuthorInAndCreatedAtBetween(
                        displayedUsers,
                        sinceCursor.createdAt,
                        maxCursor.createdAt,
                        paginationRequest
                    );
                } else {
                    statuses = await this.statusesRepository.findByCreatedAtBetween(
                        sinceCursor.createdAt,
                        maxCursor.createdAt,
                        paginationRequest
                    );
                }
            } else {
                const maxCursor = await this.findStatusById(feedCursors.maxId);

                if (shouldFilterUsers) {
                    statuses = await this.statusesRepository.findByAuthorInAndCreatedAtBefore(
                        displayedUsers,
                        maxCursor.createdAt,
                        paginationRequest
                    );
                } else {
                    statuses = await this.statusesRepository.findByCreatedAtBefore(maxCursor.createdAt, paginationRequest);
                }
            }
        } else if (feedCursors.sinceId) {
            const sinceCursor = await this.findStatusById(feedCursors.sinceId);

            if (shouldFilterUsers) {
                statuses = await this.statusesRepository.findByAuthorInAndCreatedAfter(
                    displayedUsers,
                    sinceCursor.createdAt,
                    paginationRequest
                );
            } else {
                statuses = await this.statusesRepository.findByCreatedAtAfter(sinceCursor.createdAt, paginationRequest);
            }
        } else {
            if (shouldFilterUsers) {
                statuses = await this.statusesRepository.findByAuthorIn(
                    displayedUsers,
                    paginationRequest
                );
            } else {
                statuses = await this.statusesRepository.findAllBy(paginationRequest);
            }

            if (!currentUser && config.ENABLE_PINNED_STATUSES_FOR_UNAUTHORIZED_USERS) {
                let pinnedStatus: Status | undefined;

                if (language === Language.ENGLISH && config.ENGLISH_PINNED_STATUS_ID) {
                    pinnedStatus = await this.statusesRepository.findById(config.ENGLISH_PINNED_STATUS_ID);
                } else if (language === Language.KOREAN && config.KOREAN_PINNED_STATUS_ID) {
                    pinnedStatus = await this.statusesRepository.findById(config.KOREAN_PINNED_STATUS_ID);
                }

                if (pinnedStatus) {
                    statuses.unshift(pinnedStatus);
                }
            }
        }

        const statusInfoMap = await this.statusesRepository.getStatusesAdditionalInfoMap(statuses, currentUser);

        return this.mapStatusesToStatusesResponseByStatusInfo(statuses, statusInfoMap);
    }

    private async mapStatusesToStatusesResponseByStatusInfo(statuses: Status[], statusInfoMap: StatusInfoMap): Promise<StatusResponse[]> {
        return asyncMap(statuses, status => this.statusesMapper.toStatusResponseByStatusInfo(
            status,
            statusInfoMap[status.id],
            status.referredStatus && statusInfoMap[status.referredStatus.id]
        ))
    }

    private async mapStatusesToStatusesResponse(statuses: Status[], currentUser?: User): Promise<StatusResponse[]> {
        return asyncMap(statuses, status => this.statusesMapper.toStatusResponseAsync(status, currentUser))
    }

    private async findStatusById(id: string): Promise<Status> {
        const status = await this.statusesRepository.findById(id);

        if (!status) {
            throw new HttpException(`Could not find status with id ${id}`, HttpStatus.NOT_FOUND);
        }

        return status;
    }
}
