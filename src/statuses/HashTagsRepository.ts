import {EntityRepository, Repository, Not} from "typeorm";
import {HashTag} from "./entities";
import {Language} from "../users/entities";
import { MEMEZATOR_HASHTAG } from "../common/constants";

@EntityRepository(HashTag)
export class HashTagsRepository extends Repository<HashTag> {
    public async findByNameAndLanguage(name: string, language: Language): Promise<HashTag | undefined> {
        const hashTag = await this.findOne({
            where: {
                name,
                language
            }
        });

        if (hashTag) {
            return hashTag;
        } else {
            if (language !== Language.ENGLISH) {
                return await this.findOne({
                    where: {
                        name,
                        language: Language.ENGLISH
                    }
                });
            } else {
                return hashTag; // return undefined value if language is english
            }
        }
    }

    public async findOneByName(name: string): Promise<HashTag | undefined> {
        return await this.findOne({
            where: {
                name,
            }
        });
    }

    public findByLanguageOrderByPostsCount(language: Language, count: number) {
        return this.find({
            where: {
                language
            },
            order: {
                postsCount: "DESC"
            },
            take: count
        })
    }

    public findByLanguageOrderByPostsCountExcludeMemezator(language: Language, count: number) {
        return this.find({
            where: {
                language,
                name: Not(MEMEZATOR_HASHTAG)
            },
            order: {
                postsCount: "DESC"
            },
            take: count
        })
    }

    public findAllOrderByPostsCount(count: number) {
        return this.find({
            order: {
                postsCount: "DESC"
            },
            take: count
        })
    }

    public findAllOrderByPostsCountExcludeMemezator(count: number) {
        return this.find({
            where: {
                name: Not(MEMEZATOR_HASHTAG),
            },
            order: {
                postsCount: "DESC"
            },
            take: count
        })
    }

    public findById(id: string): Promise<HashTag | undefined> {
        return this.findOne({
            where: {
                id
            }
        });
    }
}
