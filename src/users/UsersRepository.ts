import {Repository, EntityRepository, In, Not} from "typeorm";
import {User} from "./entities";
import {calculateOffset, PaginationRequest} from "../utils/pagination";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    public findByUsername(username: string): Promise<User | undefined> {
        return this.findOne({
            where: {
                username
            }
        })
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
        return (await this.count({
            where: {
                username
            }
        })) !== 0;
    }

    public async existsByEthereumAddress(address: string): Promise<boolean> {
        return (await this.count({
            where: {
                ethereumAddress: address
            }
        })) !== 0
    }

    public findByUserNotIn(users: User[], paginationRequest: PaginationRequest): Promise<User[]> {
        const queryBuilder = this.createQueryBuilder("user");

        return queryBuilder
            .leftJoinAndSelect("user.avatar", "avatar")
            .where({
                id: Not(In(users.map(user => user.id)))
            })
            .addSelect(
                subquery => subquery
                    .select("count(*)", "subscribers_count")
                    .from("user_subscription", "user_subscription")
                    .where("user_subscription.\"subscribedToId\" = \"user\".id"),
                "subscribers_count"
            )
            .orderBy("subscribers_count", "DESC")
            .skip(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
            .take(paginationRequest.pageSize)
            .getMany();
    }
}
