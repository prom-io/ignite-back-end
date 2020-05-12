import {Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {UserSubscription} from "./entities";
import {UserSubscriptionResponse} from "./types/response";
import {CreateUserSubscriptionRequest} from "./types/request";
import {UsersMapper} from "../users/UsersMapper";
import {User} from "../users/entities";

@Injectable()
export class UserSubscriptionsMapper {
    constructor(private readonly usersMapper: UsersMapper) {
    }

    public toUserSubscriptionResponse(userSubscription: UserSubscription): UserSubscriptionResponse {
        return {
            id: userSubscription.id,
            createdAt: userSubscription.createdAt.toISOString(),
            user: this.usersMapper.toUserResponse(userSubscription.subscribedTo)
        }
    }
}
