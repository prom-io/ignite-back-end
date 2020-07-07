import {EntityRepository, Repository} from "typeorm";
import {HashTag} from "./entities";
import {Language} from "../users/entities";

@EntityRepository(HashTag)
export class HashTagsRepository extends Repository<HashTag> {
    public findByNameAndLanguage(name: string, language: Language): Promise<HashTag | undefined> {
        return this.findOne({
            where: {
                name,
                language
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

    public findAllOrderByPostsCount(count: number) {
        return this.find({
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
