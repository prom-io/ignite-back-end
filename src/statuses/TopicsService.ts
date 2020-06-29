import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {StatusesRepository} from "./StatusesRepository";
import {HashTagsRepository} from "./HashTagsRepository";
import {StatusesMapper} from "./StatusesMapper";
import {HashTagResponse, StatusResponse} from "./types/response";
import {GetHashTagsRequest, GetStatusesByTopicRequest, GetStatusesRequest, TopicFetchType} from "./types/request";
import {HashTag, Status} from "./entities";
import {HashTagsMapper} from "./HashTagsMapper";
import {getLanguageFromString, Language, User} from "../users/entities";
import {asyncMap} from "../utils/async-map";

@Injectable()
export class TopicsService {
    constructor(private readonly statusesRepository: StatusesRepository,
                private readonly hashTagsRepository: HashTagsRepository,
                private readonly hashTagsMapper: HashTagsMapper,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async getStatusesContainingHashTags(getStatusesRequest: GetStatusesRequest, currentUser?: User): Promise<StatusResponse[]> {
        getStatusesRequest.language = getLanguageFromString(getStatusesRequest.language);
        let statuses: Status[];

        if (getStatusesRequest.type === TopicFetchType.HOT) {
            statuses = await this.getHotStatusesContainingHashTags(getStatusesRequest);
        } else {
            statuses = await this.getFreshStatusesContainingHashTags(getStatusesRequest);
        }

        return asyncMap(statuses, async status => await this.statusesMapper.toStatusResponseAsync(status, currentUser));
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
                statuses = await this.statusesRepository.findContainingHashTagsByLanguageAndCreatedAtBeforeOrderByNumberOfLikesForLastWeek(
                    getStatusesRequest.language,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                )
            }
        } else if (getStatusesRequest.sinceId) {
            const sinceCursor = await this.findStatusById(getStatusesRequest.sinceId);
            statuses = await this.statusesRepository.findContainingHashTagsByLanguageAndCreatedAtAfterOrderByNumberOfLikesForLastWeek(
                getStatusesRequest.language,
                sinceCursor.createdAt,
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

        return this.hashTagsMapper.toHashTagResponse(hashTag);
    }

    public async getHashTags(getHashTagsRequest: GetHashTagsRequest): Promise<HashTagResponse[]> {
        let hashTags: HashTag[];

        if (getHashTagsRequest.language) {
            hashTags = await this.hashTagsRepository.findByLanguageOrderByPostsCount(getHashTagsRequest.language, getHashTagsRequest.count);
        } else {
            hashTags = await this.hashTagsRepository.findAllOrderByPostsCount(getHashTagsRequest.count);
        }

        return hashTags.map(hashTag => this.hashTagsMapper.toHashTagResponse(hashTag));
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

        return asyncMap(statuses, async status => await this.statusesMapper.toStatusResponseAsync(status, currentUser));
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

        if (getStatusesByTopicRequest.maxId) {
            if (getStatusesByTopicRequest.sinceId) {
                const sinceCursor = await this.findStatusById(getStatusesByTopicRequest.sinceId);
                const maxCursor = await this.findStatusById(getStatusesByTopicRequest.maxId);
                statuses = await this.statusesRepository.findByHashTagAndCreatedAtBetweenOrderByNumberOfLikesForLastWeek(
                    hashTag,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                )
            } else {
                const maxCursor = await this.findStatusById(getStatusesByTopicRequest.sinceId);
                statuses = await this.statusesRepository.findByHashTagAndCreatedAtBeforeOrderByNumberOfLikesForLastWeek(
                    hashTag,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                )
            }
        } else if (getStatusesByTopicRequest.sinceId) {
            const sinceCursor = await this.findStatusById(getStatusesByTopicRequest.maxId);
            statuses = await this.statusesRepository.findByHashTagAndCreatedAtBeforeOrderByNumberOfLikesForLastWeek(
                hashTag,
                sinceCursor.createdAt,
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
}
