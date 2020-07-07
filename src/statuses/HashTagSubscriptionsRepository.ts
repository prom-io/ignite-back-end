import {EntityRepository, In, Repository} from "typeorm";
import {HashTag, HashTagSubscription, HashTagSubscriptionMap} from "./entities";
import {User} from "../users/entities";

@EntityRepository(HashTagSubscription)
export class HashTagSubscriptionsRepository extends Repository<HashTagSubscription>{
    public findByUserAndNotReverted(user: User): Promise<HashTagSubscription[]> {
        return this.find({
            where: {
                user,
                reverted: false
            }
        });
    }

    public findByUserAndHashTagAndNotReverted(user: User, hashTag: HashTag): Promise<HashTagSubscription | undefined> {
        return this.findOne({
            where: {
                user,
                hashTag,
                reverted: false
            }
        });
    }

    public async existsByUserAndHashTag(user: User, hashTag: HashTag): Promise<boolean> {
        return (await this.count({
            where: {
                user,
                hashTag,
                reverted: false
            }
        })) !== 0;
    }

    public async getHashTagSubscriptionMap(hashTags: HashTag[], currentUser?: User): Promise<HashTagSubscriptionMap> {
        const map: HashTagSubscriptionMap = {};

        const hashTagIds = hashTags.map(hashTag => hashTag.id);

        hashTagIds.forEach(id => map[id] = false);

        if (!currentUser) {
            return map;
        }

        const rawResults: any[] = await this.createQueryBuilder("hash_tag_subscription")
            .select(`"hashTagId" as hash_tag_id, count(hash_tag_subscription.id) as subscriptions_count`)
            .groupBy(`hash_tag_id`)
            .where({
                hashTag: In(hashTags.map(hashTag => hashTag.id)),
                user: currentUser,
                reverted: false
            })
            .groupBy("hash_tag_id")
            .getRawMany();

        if (rawResults.length === 0) {
            return map;
        } else {
            rawResults.forEach(rawResult => map[rawResult.hash_tag_id] = Boolean(Number(rawResult.subscriptions_count)));
        }

        return map;
    }
}
