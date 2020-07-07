import {Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {uniq} from "lodash";
import {HashTagsRepository} from "./HashTagsRepository";
import {HashTag} from "./entities";
import {asyncMap} from "../utils/async-map";
import {Language} from "../users/entities";

const HASH_TAG_REGEXP = /([#|＃][^\s]+)/g;
const REPEATED_HASH_CHARACTER_REGEXP = /([#])\1+/;

@Injectable()
export class HashTagsRetriever {
    constructor(private readonly hashTagsRepository: HashTagsRepository) {
    }

    public getHashTagsStringsFromText(text?: string): string[] {
        if (!text) {
            return [];
        }

        return text.split(HASH_TAG_REGEXP)
            .filter(chunk => HASH_TAG_REGEXP.test(chunk) && !REPEATED_HASH_CHARACTER_REGEXP.test(chunk))
            .map(chunk => chunk.substring(1, chunk.length));
    }

    public async getHashTagsEntitiesFromText(text: string, language: Language | undefined = Language.ENGLISH): Promise<HashTag[]> {
        const hashTagsStrings = uniq(this.getHashTagsStringsFromText(text));

        if (hashTagsStrings.length === 0) {
            return [];
        } else {
            return asyncMap(hashTagsStrings, async hashTagString => {
                let hashTag = await this.hashTagsRepository.findByNameAndLanguage(hashTagString, language);

                if (hashTag) {
                    return hashTag;
                } else {
                    hashTag = {
                        id: uuid(),
                        name: hashTagString,
                        createdAt: new Date(),
                        language,
                        postsCount: 0
                    };
                    hashTag = await this.hashTagsRepository.save(hashTag);
                    return hashTag;
                }
            })
        }
    }
}
