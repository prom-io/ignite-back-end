import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {StatusesMapper} from "./StatusesMapper";
import {StatusResponse} from "./types/response";
import {Status} from "./entities";
import {User, UserStatistics} from "../users/entities";
import {PaginationRequest} from "../utils/pagination";
import {UserSubscriptionsRepository} from "../user-subscriptions";
import {FeedCursors} from "./types/request/FeedCursors";
import {UserStatisticsRepository} from "../users";

@Injectable()
export class FeedService {
    constructor(private readonly subscriptionsRepository: UserSubscriptionsRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly userSubscriptionRepository: UserSubscriptionsRepository,
                private readonly statusesMapper: StatusesMapper) {
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

        const likesAndSubscriptionsMap: {
            [statusId: string]: {
                numberOfLikes: number,
                likedByCurrentUser: boolean,
                followingAuthor: boolean,
                followedByAuthor: boolean
            }} = {};
        const userStatisticsMap: {
            [userId: string]: UserStatistics
        } = {};

        for (const status of statuses) {
            likesAndSubscriptionsMap[status.id] = {
                numberOfLikes: await this.statusLikesRepository.countByStatus(status),
                likedByCurrentUser: currentUser && await this.statusLikesRepository.existByStatusAndUser(
                    status,
                    currentUser
                ),
                followingAuthor: await this.userSubscriptionRepository.existsBySubscribedUserAndSubscribedTo(
                    currentUser, status.author
                ),
                followedByAuthor: await this.userSubscriptionRepository.existsBySubscribedUserAndSubscribedTo(
                    status.author, currentUser
                )
            };

            if (!userStatisticsMap[status.author.id]) {
                userStatisticsMap[status.author.id] = await this.userStatisticsRepository.findByUser(status.author);
            }
        }

        return statuses.map(status => this.statusesMapper.toStatusResponse(
            status,
            likesAndSubscriptionsMap[status.id].numberOfLikes,
            likesAndSubscriptionsMap[status.id].likedByCurrentUser,
            userStatisticsMap[status.author.id],
            likesAndSubscriptionsMap[status.id].followingAuthor,
            likesAndSubscriptionsMap[status.id].followedByAuthor
        ))
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

        const likesAndSubscriptionsMapMap: {
            [statusId: string]: {
                numberOfLikes: number,
                likedByCurrentUser: boolean,
                followingAuthor: boolean,
                followedByAuthor: boolean
            }} = {};
        const userStatisticsMap: {
            [userId: string]: UserStatistics
        } = {};

        for (const status of statuses) {
            likesAndSubscriptionsMapMap[status.id] = {
                numberOfLikes: await this.statusLikesRepository.countByStatus(status),
                likedByCurrentUser: currentUser ? await this.statusLikesRepository.existByStatusAndUser(status, currentUser) : false,
                followingAuthor: currentUser && await this.userSubscriptionRepository.existsBySubscribedUserAndSubscribedTo(
                    currentUser, status.author
                ),
                followedByAuthor: currentUser && await this.userSubscriptionRepository.existsBySubscribedUserAndSubscribedTo(
                    status.author, currentUser
                )
            };

            if (!userStatisticsMap[status.author.id]) {
                userStatisticsMap[status.author.id] = await this.userStatisticsRepository.findByUser(status.author);
            }
        }

        return statuses.map(status => this.statusesMapper.toStatusResponse(
            status,
            likesAndSubscriptionsMapMap[status.id].numberOfLikes,
            likesAndSubscriptionsMapMap[status.id].likedByCurrentUser,
            userStatisticsMap[status.author.id],
            likesAndSubscriptionsMapMap[status.id].followingAuthor,
            likesAndSubscriptionsMapMap[status.id].followedByAuthor
        ))
    }

    private async findStatusById(id: string): Promise<Status> {
        const status = await this.statusesRepository.findById(id);

        if (!status) {
            throw new HttpException(`Could not find status with id ${id}`, HttpStatus.NOT_FOUND);
        }

        return status;
    }
}
