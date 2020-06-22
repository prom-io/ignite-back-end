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
}
