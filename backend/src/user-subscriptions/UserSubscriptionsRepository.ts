import {EntityRepository, Repository} from "typeorm";
import {UserSubscription} from "./entities";
import {User} from "../users/entities";
import {calculateOffset, PaginationRequest} from "../utils/pagination";

@EntityRepository(UserSubscription)
export class UserSubscriptionsRepository extends Repository<UserSubscription> {
    public findById(id: string): Promise<UserSubscription | undefined> {
        return this.findOne({
            where: {
                id
            }
        })
    }

    public findBySubscribedTo(subscribedTo: User, paginationRequest: PaginationRequest): Promise<UserSubscription[]> {
        return this.find({
            where: {
                subscribedTo
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize
        })
    }

    public findAllBySubscribedUser(subscribedUser: User): Promise<UserSubscription[]> {
        return this.find({
            where: {
                subscribedUser
            }
        })
    }

    public findBySubscribedUser(subscribedUser: User, paginationRequest: PaginationRequest): Promise<UserSubscription[]> {
        return this.find({
            where: {
                subscribedUser
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize
        })
    }

    public findBySubscribedUserAndSubscribedTo(subscribedUser: User, subscribedTo: User): Promise<UserSubscription | undefined> {
        return this.findOne({
            where: {
                subscribedTo,
                subscribedUser
            }
        })
    }

    public async existsBySubscribedUserAndSubscribedTo(subscribedUser: User, subscribedTo: User): Promise<boolean> {
        return (await this.count({
            where: {
                subscribedUser,
                subscribedTo
            }
        })) !== 0;
    }
}
