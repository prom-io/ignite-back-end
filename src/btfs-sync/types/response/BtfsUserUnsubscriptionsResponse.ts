import {BtfsUserSubscription} from "../btfs-entities";

export interface BtfsUserUnsubscriptionsResponse {
    [id: string]: BtfsUserSubscription
}
