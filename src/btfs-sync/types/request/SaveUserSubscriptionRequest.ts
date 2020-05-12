import {BaseBtfsRequest} from "./BaseBtfsRequest";
import {BtfsUserSubscription} from "../btfs-entities";

export interface SaveUserSubscriptionRequest extends BaseBtfsRequest {
    userId: string,
    data: BtfsUserSubscription
}
