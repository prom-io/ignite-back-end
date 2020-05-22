import {EntityRepository, Repository} from "typeorm";
import {HashTag} from "./entities";

@EntityRepository(HashTag)
export class HashTagsRepository extends Repository<HashTag> {
    public findByName(name: string): Promise<HashTag | undefined> {
        return this.findOne({
            where: {
                name
            }
        });
    }
}
