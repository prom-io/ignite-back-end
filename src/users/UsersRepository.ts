import {EntityRepository, In, MoreThan, Not, Repository, getRepository} from "typeorm";
import {User, UserDynamicFields} from "./entities";
import {subDays} from "date-fns";
import {FollowRecommendationFilters} from "./types/request";
import {calculateOffset} from "../utils/pagination";
import {Status, StatusLike} from "../statuses/entities";
import {UserSubscription} from "../user-subscriptions/entities";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    public async findByUsername(username: string): Promise<User | undefined> {
        const userDynamicFieldsRepository = getRepository<UserDynamicFields>(UserDynamicFields);

        const userDynamicFields = await userDynamicFieldsRepository.find({
            where: {
                username
            },
            relations: ["user"]
        });

        if (userDynamicFields.length === 0) {
            return undefined;
        }

        return userDynamicFields
            .filter(fields => fields.username === username && fields.user.getLatestDynamicFields().id === fields.id)
            .map(fields => fields.user)[0];
    }

    public findByEthereumAddress(ethereumAddress: string): Promise<User | undefined> {
        return this.findOne({
            where: {
                ethereumAddress
            }
        })
    }

    public findByEthereumAddressIn(addresses: string[]): Promise<User[]> {
        return this.find({
            where: {
                ethereumAddress: In(addresses)
            }
        })
    }

    public findAllByEthereumAddresses(addresses: string[]): Promise<User[]> {
        return this.find({
            where: {
                ethereumAddress: In(addresses)
            }
        })
    }

    public findById(id: string): Promise<User | undefined> {
        return this.findOne({
            where: {
                id
            }
        })
    }

    public async existsByUsername(username: string): Promise<boolean> {
        return Boolean(await this.findByUsername(username));
    }

    public async existsByEthereumAddress(address: string): Promise<boolean> {
        return (await this.count({
            where: {
                ethereumAddress: address
            }
        })) !== 0
    }

    public findMostPopularNotIn(users: User[], filters: FollowRecommendationFilters): Promise<User[]> {
        const queryBuilder = this.createQueryBuilder("user");

        return queryBuilder
            .leftJoinAndSelect("user.avatar", "avatar")
            .leftJoinAndSelect("user.preferences", "preferences")
            .leftJoinAndSelect("user.dynamicFields", "dynamicFields")
            .where({
                id: Not(In(users.map(user => user.id))),
            })
            .andWhere(`preferences.language = :language`, {language: filters.language})
            .addSelect(
                subquery => subquery
                    .select("count(*)", "subscribers_count")
                    .from("user_subscription", "user_subscription")
                    .where("user_subscription.\"subscribedToId\" = \"user\".id"),
                "subscribers_count"
            )
            .orderBy("subscribers_count", "DESC")
            .skip(calculateOffset(filters.page, filters.pageSize))
            .take(filters.pageSize)
            .getMany();
    }

    public countAll(): Promise<number> {
        return this.count();
    }

    public countAllByCreatedAtLessAfter(createdAtAfter: Date): Promise<number> {
        return this.count({
            where: {
                createdAt: MoreThan(createdAtAfter)
            }
        });
    }

    public async countAllHavingActivityWithinLastDay(): Promise<number> {
        const dayAgo = subDays(new Date(), 1);

        return this.createQueryBuilder("user")
            .select(`count(distinct("user".id))`)
            .leftJoinAndSelect(StatusLike, "status_like", `status_like."userId" = "user".id`)
            .leftJoinAndSelect(UserSubscription, "user_subscription", `user_subscription."subscribedUserId" = "user".id`)
            .leftJoinAndSelect(Status, "status", `status."authorId" = "user".id`)
            .where(`status_like."createdAt" > :dayAgo`, {dayAgo})
            .orWhere(`user_subscription."createdAt" > :dayAgo`, {dayAgo})
            .orWhere(`status."createdAt" > :dayAgo`, {dayAgo})
            .getCount();
    }
}
