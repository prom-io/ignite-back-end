import {EntityRepository, Repository} from "typeorm";
import {User, UserSubscription} from "../microblogging/entities";
import {PaginationRequest} from "../microblogging/types/request";
import {calculateOffset} from "../utils/pagination";

@EntityRepository(UserSubscription)
export class UserSubscriptionRepository extends Repository<UserSubscription> {
    public findBySubscribedTo(subscribedTo: User, paginationRequest: PaginationRequest): Promise<UserSubscription[]> {
        return this.find({
            where: {
                subscribedTo
            },
            skip: calculateOffset(paginationRequest.page, paginationRequest.pageSize),
            take: paginationRequest.pageSize
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
}
