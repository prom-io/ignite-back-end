import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {isAfter, subDays} from "date-fns";
import {StatusesRepository} from "./StatusesRepository";
import {HashTagsRepository} from "./HashTagsRepository";
import {StatusesMapper} from "./StatusesMapper";
import {HashTagResponse, StatusResponse} from "./types/response";
import {GetStatusesByTopicRequest, TopicFetchType, GetHashTagsRequest} from "./types/request";
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
        let statusesIds: string[];

        if (getStatusesByTopicRequest.maxId) {
            if (getStatusesByTopicRequest.sinceId) {
                const sinceCursor = await this.findStatusById(getStatusesByTopicRequest.sinceId);
                const maxCursor = await this.findStatusById(getStatusesByTopicRequest.maxId);
                statusesIds = await this.statusesRepository.findIdsByHashTagAndCreatedAtBetween(
                    hashTag,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                );
            } else {
                const maxCursor = await this.findStatusById(getStatusesByTopicRequest.maxId);
                statusesIds = await this.statusesRepository.findIdsByHashTagAndCreatedAtBefore(
                    hashTag,
                    maxCursor.createdAt,
                    {page: 1, pageSize: 30}
                );
            }
        } else if (getStatusesByTopicRequest.sinceId) {
            const sinceCursor = await this.findStatusById(getStatusesByTopicRequest.sinceId);
            statusesIds = await this.statusesRepository.findIdsByHashTagAndCreatedAtAfter(
                hashTag,
                sinceCursor.createdAt,
                {page: 1, pageSize: 30}
            )
        } else {
            statusesIds = await this.statusesRepository.findIdsByHashTag(hashTag, {page: 1, pageSize: 30});
        }

        return this.statusesRepository.findAllByIds(statusesIds);
    }

    private async getHotStatusesByHashTag(hashTag: HashTag, getStatusesByTopicRequest: GetStatusesByTopicRequest) {
        const weekAgo = subDays(new Date(), 7);
        let statusesIds: string[];

        if (getStatusesByTopicRequest.maxId) {
            if (getStatusesByTopicRequest.sinceId) {
                const sinceCursor = await this.findStatusById(getStatusesByTopicRequest.sinceId);
                const maxCursor = await this.findStatusById(getStatusesByTopicRequest.maxId);
                statusesIds = await this.statusesRepository.findIdsByHashTagAndCreatedAtBetweenOrderByNumberOfLikes(
                    hashTag,
                    isAfter(sinceCursor.createdAt, weekAgo) ? sinceCursor.createdAt : weekAgo,
                    isAfter(maxCursor.createdAt, weekAgo) ? maxCursor.createdAt : weekAgo,
                    {page: 1, pageSize: 30}
                )
            } else {
                const sinceCursor = await this.findStatusById(getStatusesByTopicRequest.sinceId);
                statusesIds = await this.statusesRepository.findIdsByHashTagAndCreatedAtBetweenOrderByNumberOfLikes(
                    hashTag,
                    isAfter(sinceCursor.createdAt, weekAgo) ? sinceCursor.createdAt : weekAgo,
                    weekAgo,
                    {page: 1, pageSize: 30}
                )
            }
        } else if (getStatusesByTopicRequest.sinceId) {
            const maxCursor = await this.findStatusById(getStatusesByTopicRequest.maxId);
            statusesIds = await this.statusesRepository.findIdsByHashTagAndCreatedAtAfterOrderByNumberOfLikes(
                hashTag,
                isAfter(maxCursor.createdAt, weekAgo) ? maxCursor.createdAt : weekAgo,
                {page: 1, pageSize: 30}
            )
        } else {
            statusesIds = await this.statusesRepository.findIdsByHashTagAndCreatedAtAfterOrderByNumberOfLikes(
                hashTag,
                weekAgo,
                {page: 1, pageSize: 30}
            )
        }

        return this.statusesRepository.findAllByIds(statusesIds);
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
