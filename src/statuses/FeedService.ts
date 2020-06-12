import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {StatusesMapper} from "./StatusesMapper";
import {StatusResponse} from "./types/response";
import {FeedCursors} from "./types/request/FeedCursors";
import {Status, StatusAdditionalInfo, StatusInfoMap} from "./entities";
import {User} from "../users/entities";
import {PaginationRequest} from "../utils/pagination";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {UsersRepository, UserStatisticsRepository} from "../users";
import {asyncMap} from "../utils/async-map";
import {config} from "../config";

@Injectable()
export class FeedService {
    constructor(private readonly subscriptionsRepository: UserSubscriptionsRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly usersRepository: UsersRepository,
                private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly userSubscriptionRepository: UserSubscriptionsRepository,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async getFeedOfCurrentUserAfter(currentUser: User, feedCursors: FeedCursors, useNewRetrievingMethod: boolean = false): Promise<StatusResponse[]> {
        const subscriptions = await this.subscriptionsRepository.findAllBySubscribedUserNotReverted(currentUser);
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

        if (useNewRetrievingMethod) {
            const statusesIds = [];

            statuses.forEach(status => {
                statusesIds.push(status.id);

                if (status.referredStatus) {
                    statusesIds.push(status.referredStatus.id);
                }
            });

            const statusInfoList = await this.statusesRepository.findStatusInfoByStatusIdIn(statusesIds, currentUser);

            const statusInfoMap: StatusInfoMap = {};

            statusInfoList.forEach(statusInfo => statusInfoMap[statusInfo.id] = statusInfo);

            return this.mapStatusesToStatusesResponseByStatusInfo(statuses, statusInfoMap);
        } else {
            return this.mapStatusesToStatusesResponse(statuses, currentUser);
        }
    }

    public async getGlobalFeed(feedCursors: FeedCursors, currentUser?: User, language?: string): Promise<StatusResponse[]> {
        if (language) {
            language = language === "ko" || language === "en" ? language : "en";
        }

        const paginationRequest: PaginationRequest = {
            page: 1,
            pageSize: 30
        };

        let statuses: Status[];
        let displayedUsers: User[] = [];

        if (config.ENABLE_GLOBAL_TIMELINE_FILTERING && config.KOREAN_FILTERING_USER_ADDRESS && config.ENGLISH_FILTERING_USER_ADDRESS) {
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
        }

        return this.mapStatusesToStatusesResponse(statuses, currentUser);
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
