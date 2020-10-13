import {EntityRepository, In, MoreThan, Not, Repository, Brackets, Like} from "typeorm";
import {subDays} from "date-fns";
import {SignUpReference, User} from "./entities";
import {FollowRecommendationFilters} from "./types/request";
import {calculateOffset} from "../utils/pagination";
import {Status, StatusLike} from "../statuses/entities";
import {UserSubscription} from "../user-subscriptions/entities";
import {UsersSearchFilters} from "./types/request/UsersSearchFilters";
import _ from "lodash";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {

    public searchByUsernameLike(searchOption: string, take: number, skip: number): Promise<User[]> {
        return this.find({
            where: {
                username: Like(searchOption+`%`),
                isCommunity: false
            },
            skip,
            take
        })
    }

    public findAllByIsCommunityOrderBySubscribersCountInCommunitiesDesc(): Promise<User[]> {
        return this.createQueryBuilder("user")
            .leftJoinAndSelect("user.avatar", "avatar")
            .leftJoinAndSelect("user.preferences", "preferences")
            .leftJoinAndSelect("user.statistics", "statistics")
            .addSelect( subquery =>
                subquery
                .select("count(id)", "subscribers_count")
                .from(UserSubscription, "user_subscription")
                .where(`user_subscription."subscribedUserId"=user.id`)
                .andWhere(`"isSubscribedToCommunity"=true`)
                .groupBy(`user.id`)
            )
            .where(`"isCommunity"=true`)
            .orderBy(`subscribers_count`, "DESC")
            .getMany()  
    }

    public searchByDisplayedNameLikeNotInUsername(searchOption: string, take: number, skip: number | undefined): Promise<User[]> {
        return this.createQueryBuilder("user")
            .leftJoinAndSelect("user.avatar", "avatar")
            .leftJoinAndSelect("user.preferences", "preferences")
            .leftJoinAndSelect("user.statistics", "statistics")
        .andWhere(`user.username NOT LIKE :matchPattern`, {matchPattern: `${searchOption}%`})
        .andWhere(`user.displayedName LIKE :matchPattern`, {matchPattern: `${searchOption}%`})
        .andWhere(`user.isCommunity=false`)
        .orderBy(`user.displayedName`, "ASC")
        .skip(skip)
        .take(take)
        .getMany()  
    }

    public countByUsernameLike(searchOption): Promise<number> {
        return this.count({
            where: {
                username: Like(searchOption+`%`),
                isCommunity: false
            }
        })
    }

    public search(filters: UsersSearchFilters): Promise<User[]> {
        const qb = this.createQueryBuilder("user")
            .leftJoinAndSelect("user.avatar", "avatar")
            .leftJoinAndSelect("user.preferences", "preferences")
            .leftJoinAndSelect("user.statistics", "statistics")

        if (filters.q) {
            qb.where(new Brackets(qbInBrackets => {
                qbInBrackets
                    .where("user.displayedName ILIKE :matchPattern", {matchPattern: `${filters.q}%`})
                    .orWhere("user.username ILIKE :matchPattern", {matchPattern: `${filters.q}%`})
                    .orWhere("user.ethereumAddress = :ethereumAddress", {ethereumAddress: filters.q})
            }))
        }

        if (filters.language) {
            qb.andWhere(`preferences.language = :language`, {language: filters.language})
        }

        if (filters.skip) {
            qb.skip(filters.skip)
        }

        if (filters.take) {
            qb.take(filters.take)
        }

        return qb.getMany()
    }

    public findAllByAddresses(addresses: string[]): Promise<User[]> {
        return this.find({
            where: {
                ethereumAddress: In(addresses)
            }
        })
    }

    public async findByUsername(username: string): Promise<User | undefined> {
        let user: User | undefined = await this.findOne({
            where: {
                username
            }
        });

        if (!user) {
            user = await this.findByUsernameEqualsIgnoreCase(username);
        }

        return user;
    }

    public findByEthereumAddress(ethereumAddress: string): Promise<User | undefined> {
        return this.findOne({
            where: {
                ethereumAddress
            }
        })
    }

    public findByEthereumAddressIn(addresses: string[]): Promise<User[]> {
        if (_.isEmpty(addresses)) {
            return Promise.resolve([])
        }

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
        const usersCount = await this.count({
            where: {
                username
            }
        });

        if (usersCount === 0) {
            return this.exitsByUsernameEqualsIgnoreCase(username);
        }

        return usersCount === 0;
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

    public countBySignUpReference(signUpReference: SignUpReference): Promise<number> {
        return this.count({
            where: {
                signUpReference
            }
        })
    }

    public findBySignUpReference(signUpReference: SignUpReference): Promise<User[]> {
        return this.find({
            where: {
                signUpReference
            }
        });
    }

    public findByUsernameEqualsIgnoreCase(username: string): Promise<User> {
        return this.createQueryBuilder("user")
            .leftJoinAndSelect(`user.preferences`, "preferences")
            .leftJoinAndSelect(`user.statistics`, "statistics")
            .leftJoinAndSelect(`user.avatar`, "avatar")
            .where(`LOWER("user".username) = LOWER(:username)`, {username})
            .getOne();
    }

    public async exitsByUsernameEqualsIgnoreCase(username: string): Promise<boolean> {
        return (await this.createQueryBuilder("user")
                .where(`LOWER("user".username) = LOWER(:username)`, {username})
                .getCount()
        ) !== 0;
    }
}
