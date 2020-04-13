import {BaseBtfsRequest} from "./BaseBtfsRequest";
import {BtfsUserSubscription} from "../btfs-entities";

export interface SaveUserUnsubscriptionRequest {
    data: BtfsUserSubscription
}
