import { MEMEZATOR_HASHTAG } from './../common/constants';
import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {subDays} from "date-fns";
import {StatusesRepository} from "./StatusesRepository";
import {HashTagsRepository} from "./HashTagsRepository";
import {StatusesMapper} from "./StatusesMapper";
import {HashTagResponse, StatusResponse} from "./types/response";
import {GetHashTagsRequest, GetStatusesByTopicRequest, GetStatusesRequest, TopicFetchType} from "./types/request";
import {HashTag, HashTagSubscription, Status} from "./entities";
import {HashTagsMapper} from "./HashTagsMapper";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {HashTagSubscriptionsRepository} from "./HashTagSubscriptionsRepository";
import {getLanguageFromString, Language, User} from "../users/entities";
import {asyncMap} from "../utils/async-map";

@Injectable()
export class TopicsService {
    constructor(private readonly statusesRepository: StatusesRepository,
                private readonly hashTagsRepository: HashTagsRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly hashTagsMapper: HashTagsMapper,
                private readonly hashTagSubscriptionsRepository: HashTagSubscriptionsRepository,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async followHashTag(id: string, currentUser: User): Promise<HashTagResponse> {
        const hashTag = await this.findHashTagById(id);

        const existingSubscription = await this.hashTagSubscriptionsRepository.findByUserAndHashTagAndNotReverted(currentUser, hashTag);

        if (existingSubscription) {
            throw new HttpException(
                `Current user already follows topic with id ${existingSubscription.id}`,
                HttpStatus.CONFLICT
            );
        }

        let hashTagSubscription: HashTagSubscription = {
            id: uuid(),
            reverted: false,
            user: currentUser,
            createdAt: new Date(),
            hashTag
        };

        hashTagSubscription = await this.hashTagSubscriptionsRepository.save(hashTagSubscription);

        return this.hashTagsMapper.toHashTagResponse(hashTagSubscription.hashTag, true);
    }

    public async unfollowHashTag(id: string, currentUser: User): Promise<HashTagResponse> {
        const hashTag = await this.findHashTagById(id);

        const subscription = await this.hashTagSubscriptionsRepository.findByUserAndHashTagAndNotReverted(
            currentUser,
            hashTag
        );

        if (!subscription) {
            throw new HttpException(
                `Current user does not follow hash tag with id ${hashTag.id}`,
                HttpStatus.NOT_FOUND
            );
        }

        subscription.reverted = true;
        await this.hashTagSubscriptionsRepository.save(subscription);

        return this.hashTagsMapper.toHashTagResponse(hashTag, false);
    }

    private async getStatusesContainingMemeHashTag(getStatusesRequest: GetStatusesRequest): Promise<Status[]> {
        let statuses: Status[];
        if (getStatusesRequest.maxId) {
            if (getStatusesRequest.sinceId) {
                const sinceCursor = await this.findStatusById(getStatusesRequest.sinceId);
                const maxCursor = await this.findStatusById(getStatusesRequest.maxId);
                statuses = await this.statusesRepository.findContainingHashTagsByLanguageAndCreatedAtBetween(
                    getStatusesRequest.language,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                )
            } else {
                const maxCursor = await this.findStatusById(getStatusesRequest.maxId);
                statuses = await this.statusesRepository.findContainingMemeHashTagByLanguageAndCreatedAtBefore(
                    getStatusesRequest.language,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                );
            }
        } else if (getStatusesRequest.sinceId) {
            const sinceCursor = await this.findStatusById(getStatusesRequest.sinceId);
            statuses = await this.statusesRepository.findContainingMemeHashTagByLanguageAndCreatedAtAfter(
                getStatusesRequest.language,
                sinceCursor.createdAt,
                {page: 1, pageSize: 30}
            );
        } else {
            statuses = await this.statusesRepository.findContainingMemeHashTagByLanguage(
                getStatusesRequest.language,
                {page: 1, pageSize: 30}
            );
        }

        return statuses;
    }

    public async getStatusesContainingHashTags(getStatusesRequest: GetStatusesRequest, currentUser?: User): Promise<StatusResponse[]> {
        getStatusesRequest.language = getLanguageFromString(getStatusesRequest.language);
        let statuses: Status[];

        if (!await this.statusesRepository.existsContainingHashTagsByLanguage(getStatusesRequest.language)) {
            getStatusesRequest.language = Language.ENGLISH;
        }

        if (getStatusesRequest.type === TopicFetchType.MEMES) {
            statuses = await this.getStatusesContainingMemeHashTag(getStatusesRequest);
        } else if (getStatusesRequest.type === TopicFetchType.HOT) {
            statuses = await this.getHotStatusesContainingHashTags(getStatusesRequest);
        } else {
            statuses = await this.getFreshStatusesContainingHashTags(getStatusesRequest);
        } 

        const statusInfoMap = await this.statusesRepository.getStatusesAdditionalInfoMap(statuses, currentUser);

        return asyncMap(statuses, async status => await this.statusesMapper.toStatusResponseByStatusInfo(
            status,
            statusInfoMap[status.id],
            status.referredStatus && statusInfoMap[status.referredStatus.id]
        ));
    }

    private async getFreshStatusesContainingHashTags(getStatusesRequest: GetStatusesRequest): Promise<Status[]> {
        let statuses: Status[];

        if (getStatusesRequest.maxId) {
            if (getStatusesRequest.sinceId) {
                const sinceCursor = await this.findStatusById(getStatusesRequest.sinceId);
                const maxCursor = await this.findStatusById(getStatusesRequest.maxId);
                statuses = await this.statusesRepository.findContainingHashTagsByLanguageAndCreatedAtBetween(
                    getStatusesRequest.language,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                )
            } else {
                const maxCursor = await this.findStatusById(getStatusesRequest.maxId);
                statuses = await this.statusesRepository.findContainingHashTagsByLanguageAndCreatedAtBefore(
                    getStatusesRequest.language,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                );
            }
        } else if (getStatusesRequest.sinceId) {
            const sinceCursor = await this.findStatusById(getStatusesRequest.sinceId);
            statuses = await this.statusesRepository.findContainingHashTagsByLanguageAndCreatedAtAfter(
                getStatusesRequest.language,
                sinceCursor.createdAt,
                {page: 1, pageSize: 30}
            );
        } else {
            statuses = await this.statusesRepository.findContainingHashTagsByLanguage(
                getStatusesRequest.language,
                {page: 1, pageSize: 30}
            );
        }

        return statuses;
    }

    private async getHotStatusesContainingHashTags(getStatusesRequest: GetStatusesRequest): Promise<Status[]> {
        let statuses: Status[];
        if (getStatusesRequest.maxId) {
            if (getStatusesRequest.sinceId) {
                const sinceCursor = await this.findStatusById(getStatusesRequest.sinceId);
                const maxCursor = await this.findStatusById(getStatusesRequest.maxId);
                statuses = await this.statusesRepository.findContainingHashTagsByLanguageAndCreatedAtBetweenOrderByNumberOfLikesForLastWeek(
                    getStatusesRequest.language,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                );
            } else {
                const maxCursor = await this.findStatusById(getStatusesRequest.maxId);
                const maxLikes = await this.statusLikesRepository.countByStatus(maxCursor);
                statuses = await this.statusesRepository.findContainingHashTagsByLanguageAndCreatedAtBeforeAndLikesForLastWeekLessThanOrderByNumberOfLikesForLastWeek(
                    getStatusesRequest.language,
                    maxCursor.createdAt,
                    maxLikes,
                    {page: 1, pageSize: 30}
                )
            }
        } else if (getStatusesRequest.sinceId) {
            const sinceCursor = await this.findStatusById(getStatusesRequest.sinceId);
            const minLikes = await this.statusLikesRepository.countByStatus(sinceCursor);
            statuses = await this.statusesRepository.findContainingHashTagsByLanguageAndCreatedAtAfterAndLikesForLastWeekMoreThanOrderByNumberOfLikesForLastWeek(
                getStatusesRequest.language,
                sinceCursor.createdAt,
                minLikes,
                {page: 1, pageSize: 30}
            );
        } else {
            statuses = await this.statusesRepository.findContainingHashTagsByLanguageOrderByNumberOfLikesForLastWeek(
                getStatusesRequest.language,
                {page: 1, pageSize: 30}
            )
        }

        return statuses;
    }

    public async getHashTagByNameAndLanguage(name: string, languageString?: string, currentUser?: User): Promise<HashTagResponse> {
        let language: Language;

        if (languageString) {
            language = getLanguageFromString(languageString);
        } else {
            language = (currentUser && currentUser.preferences) ? currentUser.preferences.language : Language.ENGLISH;
        }

        const hashTag = await this.hashTagsRepository.findByNameAndLanguage(name, language);

        if (!hashTag) {
            throw new HttpException(
                `Could not find topic with name ${name} and language ${language}`,
                HttpStatus.NOT_FOUND
            );
        }

        const following = currentUser ? await this.hashTagSubscriptionsRepository.existsByUserAndHashTag(currentUser, hashTag) : false;

        return this.hashTagsMapper.toHashTagResponse(hashTag, following);
    }

    public async getHashTags(getHashTagsRequest: GetHashTagsRequest, currentUser?: User): Promise<HashTagResponse[]> {
        let hashTags: HashTag[];

        if (getHashTagsRequest.language) {
            hashTags = await this.hashTagsRepository.findByLanguageOrderByPostsCount(getHashTagsRequest.language, getHashTagsRequest.count);
        } else {
            hashTags = await this.hashTagsRepository.findAllOrderByPostsCount(getHashTagsRequest.count);
        }

        const hashTagSubscriptionMap = await this.hashTagSubscriptionsRepository.getHashTagSubscriptionMap(hashTags, currentUser);

        return hashTags.map(hashTag => this.hashTagsMapper.toHashTagResponse(hashTag, hashTagSubscriptionMap[hashTag.id]));
    }

    public async findStatusesByHashTag(
        hashTagName: string,
        getStatusesByTopicRequest: GetStatusesByTopicRequest,
        currentUser?: User
    ): Promise<StatusResponse[]> {
        let language = getStatusesByTopicRequest.language;

        if (!language) {
            language = currentUser ? currentUser.preferences.language : Language.ENGLISH;
        }

        const hashTag = await this.hashTagsRepository.findByNameAndLanguage(hashTagName, language);

        if (!hashTag) {
            throw new HttpException(
                `Could not find hash tag ${hashTagName} for language ${language}`,
                HttpStatus.NOT_FOUND
            );
        }

        let statuses: Status[];

        if (getStatusesByTopicRequest.type === TopicFetchType.FRESH) {
            statuses = await this.getFreshStatusesByHashTag(hashTag, getStatusesByTopicRequest);
        } else {
            statuses = await this.getHotStatusesByHashTag(hashTag, getStatusesByTopicRequest);
        }

        const statusInfoMap = await this.statusesRepository.getStatusesAdditionalInfoMap(statuses, currentUser);

        return asyncMap(statuses, async status => await this.statusesMapper.toStatusResponseByStatusInfo(
            status,
            statusInfoMap[status.id],
            status.referredStatus && statusInfoMap[status.referredStatus.id]
        ));
    }

    private async getFreshStatusesByHashTag(hashTag: HashTag, getStatusesByTopicRequest: GetStatusesByTopicRequest): Promise<Status[]> {
        let statuses: Status[];

        if (getStatusesByTopicRequest.maxId) {
            if (getStatusesByTopicRequest.sinceId) {
                const sinceCursor = await this.findStatusById(getStatusesByTopicRequest.sinceId);
                const maxCursor = await this.findStatusById(getStatusesByTopicRequest.maxId);
                statuses = await this.statusesRepository.findByHashTagAndCreatedAtBetween(
                    hashTag,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                );
            } else {
                const maxCursor = await this.findStatusById(getStatusesByTopicRequest.maxId);
                statuses = await this.statusesRepository.findByHashTagAndCreatedAtBefore(
                    hashTag,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                );
            }
        } else if (getStatusesByTopicRequest.sinceId) {
            const sinceCursor = await this.findStatusById(getStatusesByTopicRequest.sinceId);
            statuses = await this.statusesRepository.findByHashTagAndCreatedAtAfter(
                hashTag,
                sinceCursor.createdAt,
                {page: 1, pageSize: 30}
            )
        } else {
            statuses = await this.statusesRepository.findByHashTag(hashTag, {page: 1, pageSize: 30});
        }

        return statuses;
    }

    private async getHotStatusesByHashTag(hashTag: HashTag, getStatusesByTopicRequest: GetStatusesByTopicRequest) {
        let statuses: Status[];
        const weekAgo = subDays(new Date(), 7);

        if (getStatusesByTopicRequest.maxId) {
            if (getStatusesByTopicRequest.sinceId) {
                const sinceCursor = await this.findStatusById(getStatusesByTopicRequest.sinceId);
                const maxCursor = await this.findStatusById(getStatusesByTopicRequest.maxId);
                const minLikes = await this.statusLikesRepository.countByStatusAndCreatedAtAfterNotReverted(
                    sinceCursor,
                    weekAgo
                );
                const maxLikes = await this.statusLikesRepository.countByStatusAndCreatedAtAfterNotReverted(
                    maxCursor,
                    weekAgo
                );
                statuses = await this.statusesRepository.findByHashTagAndCreatedAtBetweenAndLikesForLastWeekBetweenOrderByNumberOfLikesForLastWeek(
                    hashTag,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    minLikes,
                    maxLikes,
                    {page: 1, pageSize: 30}
                )
            } else {
                const maxCursor = await this.findStatusById(getStatusesByTopicRequest.maxId);
                const maxLikes = await this.statusLikesRepository.countByStatusAndCreatedAtAfterNotReverted(
                    maxCursor,
                    weekAgo
                );
                statuses = await this.statusesRepository.findByHashTagAndCreatedAtBeforeAndLikesForLastWeekLessThanOrderByNumberOfLikesForLastWeek(
                    hashTag,
                    maxCursor.createdAt,
                    maxLikes,
                    {page: 1, pageSize: 30}
                )
            }
        } else if (getStatusesByTopicRequest.sinceId) {
            const sinceCursor = await this.findStatusById(getStatusesByTopicRequest.sinceId);
            const minLikes = await this.statusLikesRepository.countByStatusAndCreatedAtAfterNotReverted(
                sinceCursor,
                weekAgo
            );
            statuses = await this.statusesRepository.findByHashTagAndCreatedAtAfterAndLikesForLastWeekMoreThanOrderByNumberOfLikesForLastWeek(
                hashTag,
                sinceCursor.createdAt,
                minLikes,
                {page: 1, pageSize: 30}
            )
        } else {
            statuses = await this.statusesRepository.findByHashTagOrderByNumberOfLikesForLastWeek(
                hashTag,
                {page: 1, pageSize: 30}
            )
        }

        return statuses;
    }

    private async findStatusById(id: string): Promise<Status> {
        const status = await this.statusesRepository.findById(id);

        if (!status) {
            throw new HttpException(
                `Could not find status with id ${id}`,
                HttpStatus.NOT_FOUND
            );
        }

        return status;
    }

    private async findHashTagById(id: string): Promise<HashTag> {
        const hashTag = await this.hashTagsRepository.findById(id);

        if (!hashTag) {
            throw new HttpException(
                `Could not find hash tag with id ${id}`,
                HttpStatus.NOT_FOUND
            );
        }

        return hashTag;
    }
}
