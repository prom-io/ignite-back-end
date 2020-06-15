import {Repository, EntityRepository, In, Not, getRepository} from "typeorm";
import {Language, User, UserDynamicFields} from "./entities";
import {calculateOffset, PaginationRequest} from "../utils/pagination";
import {FollowRecommendationFilters} from "./types/request";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    public async findByUsername(username: string): Promise<User | null> {
        const userDynamicFieldsRepository = getRepository<UserDynamicFields>(UserDynamicFields);

        const userDynamicFields = await userDynamicFieldsRepository.find({
            where: {
                username
            },
            relations: ["user"]
        });

        if (userDynamicFields.length === 0) {
            return null;
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
        return await this.findByUsername(username) !== null;
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
}
