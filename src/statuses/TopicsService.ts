import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {StatusesRepository} from "./StatusesRepository";
import {HashTagsRepository} from "./HashTagsRepository";
import {StatusesMapper} from "./StatusesMapper";
import {Language, User} from "../users/entities";
import {StatusResponse} from "./types/response";
import {asyncMap} from "../utils/async-map";
import {FeedCursors} from "./types/request";

@Injectable()
export class TopicsService {
    constructor(private readonly statusesRepository: StatusesRepository,
                private readonly hashTagsRepository: HashTagsRepository,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async findStatusesByHashTag(
        hashTagName: string,
        feedCursors: FeedCursors,
        language?: Language,
        currentUser?: User
    ): Promise<StatusResponse[]> {
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

        const statuses = await this.statusesRepository.findByHashTag(hashTag, {page: 1, pageSize: 30});

        return asyncMap(statuses, async status => {
            return await this.statusesMapper.toStatusResponseAsync(status, currentUser)
        })
    }
}
