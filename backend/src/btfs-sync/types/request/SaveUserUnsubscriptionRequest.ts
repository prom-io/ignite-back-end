import {BaseBtfsRequest} from "./BaseBtfsRequest";
import {BtfsUserSubscription} from "../btfs-entities";

export interface SaveUserUnsubscriptionRequest extends BaseBtfsRequest {
    data: BtfsUserSubscription
}
