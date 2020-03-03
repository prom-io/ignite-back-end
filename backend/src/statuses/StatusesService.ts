import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {StatusesRepository} from "./StatusesRepository";
import {CreateStatusRequest} from "./types/request";
import {StatusResponse} from "./types/response";
import {StatusesMapper} from "./StatusesMapper";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {User, UserStatistics} from "../users/entities";
import {UsersRepository} from "../users/UsersRepository";
import {PaginationRequest} from "../utils/pagination";
import {Status} from "./entities";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {MediaAttachment} from "../media-attachments/entities";
import {FeedCursors} from "./types/request/FeedCursors";
import {UserStatisticsRepository} from "../users";
import {UserSubscriptionsRepository} from "../user-subscriptions";

@Injectable()
export class StatusesService {
    constructor(private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly usersRepository: UsersRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly userSubscriptionRepository: UserSubscriptionsRepository,
                private readonly mediaAttachmentRepository: MediaAttachmentsRepository,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async createStatus(createStatusRequest: CreateStatusRequest, currentUser: User): Promise<StatusResponse> {
        let mediaAttachments: MediaAttachment[] = [];

        if (createStatusRequest.media_attachments && createStatusRequest.media_attachments.length) {
            mediaAttachments = await this.mediaAttachmentRepository.findAllByIds(createStatusRequest.media_attachments);
        }

        let status = this.statusesMapper.fromCreateStatusRequest(createStatusRequest, currentUser, mediaAttachments);
        status = await this.statusesRepository.save(status);
        return this.statusesMapper.toStatusResponse(status, 0, false);
    }

    public async findStatusById(id: string, currentUser?: User): Promise<StatusResponse> {
        const status = await this.statusesRepository.findOne({where: {id}});

        if (!status) {
            throw new HttpException(`Could not find status with id ${id}`, HttpStatus.NOT_FOUND);
        }

        const likesCount = await this.statusLikesRepository.countByStatus(status);
        let likedByCurrentUser = false;

        if (likesCount !== 0 && currentUser) {
            likedByCurrentUser = await this.statusLikesRepository.existByStatusAndUser(status, currentUser);
        }

        const followingAuthor = currentUser && await this.userSubscriptionRepository.existsBySubscribedUserAndSubscribedTo(
            currentUser, status.author
        );
        const followedByAuthor = currentUser && await this.userSubscriptionRepository.existsBySubscribedUserAndSubscribedTo(
            status.author, currentUser
        );

        return this.statusesMapper.toStatusResponse(
            status,
            likesCount,
            likedByCurrentUser,
            null,
            followingAuthor,
            followedByAuthor
        );
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
                console.log(maxCursor);
                statuses = await this.statusesRepository.findByAuthorAndCreatedAtBefore(user, maxCursor.createdAt, paginationRequest);
            }
        } else if (cursors.sinceId) {
            const sinceCursor = await this.findStatusEntityById(cursors.sinceId);
            statuses = await this.statusesRepository.findByAuthorAndCreatedAtAfter(user, sinceCursor.createdAt, paginationRequest);
        } else {
            statuses = await this.statusesRepository.findByAuthor(user, paginationRequest);
        }

        const likesAndSubscriptionMap: {
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
            likesAndSubscriptionMap[status.id] = {
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
            likesAndSubscriptionMap[status.id].numberOfLikes,
            likesAndSubscriptionMap[status.id].likedByCurrentUser,
            userStatisticsMap[status.author.id],
            likesAndSubscriptionMap[status.id].followingAuthor,
            likesAndSubscriptionMap[status.id].followedByAuthor
        ))
    }

    private async findStatusEntityById(id: string): Promise<Status> {
        const status = await this.statusesRepository.findById(id);

        if (!status) {
            throw new HttpException(`Could not find status with id ${id}`, HttpStatus.NOT_FOUND);
        }

        return status;
    }
}
