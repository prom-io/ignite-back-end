import {Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {HashTagsRepository} from "./HashTagsRepository";
import {HashTag} from "./entities";
import {asyncMap} from "../utils/async-map";

const HASH_TAG_REGEXP = /([#|＃][^\s]+)/g;

@Injectable()
export class HashTagsRetriever {
    constructor(private readonly hashTagsRepository: HashTagsRepository) {
    }

    public getHashTagsStringsFromText(text: string): string[] {
        return text.split(HASH_TAG_REGEXP)
            .filter(chunk => HASH_TAG_REGEXP.test(chunk))
            .map(chunk => chunk.substring(1, chunk.length));
    }

    public async getHashTagsEntitiesFromText(text: string): Promise<HashTag[]> {
        const hashTagsStrings = this.getHashTagsStringsFromText(text);

        if (hashTagsStrings.length === 0) {
            return [];
        } else {
            return asyncMap(hashTagsStrings, async hashTagString => {
                let hashTag = await this.hashTagsRepository.findByName(hashTagString);

                if (hashTag) {
                    return hashTag;
                } else {
                    hashTag = {
                        id: uuid(),
                        name: hashTagString,
                        createdAt: new Date()
                    };
                    hashTag = await this.hashTagsRepository.save(hashTag);
                    return hashTag;
                }
            })
        }
    }
}
