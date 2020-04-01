import {Injectable} from "@nestjs/common";
import {BtfsUsersMapper} from "./BtfsUsersMapper";
import {UserSubscription} from "../../user-subscriptions/entities";
import {BtfsUserSubscription} from "../types/btfs-entities";

@Injectable()
export class BtfsUserSubscriptionsMapper {
    constructor(private readonly btfsUsersMapper: BtfsUsersMapper) {
    }

    public fromUserSubscription(userSubscription: UserSubscription): BtfsUserSubscription {
        return {
            id: userSubscription.id,
            createdAt: userSubscription.createdAt.toISOString(),
            subscribedTo: this.btfsUsersMapper.fromUser(userSubscription.subscribedTo),
            subscribedUser: this.btfsUsersMapper.fromUser(userSubscription.subscribedUser)
        }
    }
}
