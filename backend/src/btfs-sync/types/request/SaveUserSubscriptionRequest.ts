import {BtfsUserSubscription} from "../btfs-entities";

export interface SaveUserSubscriptionRequest {
    id: string,
    userId: string,
    data: BtfsUserSubscription
}
