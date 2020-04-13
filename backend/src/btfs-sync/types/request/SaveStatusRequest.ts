import {BaseBtfsRequest} from "./BaseBtfsRequest";
import {BtfsStatus} from "../btfs-entities";

export interface SaveStatusRequest extends BaseBtfsRequest {
    data: BtfsStatus
}
