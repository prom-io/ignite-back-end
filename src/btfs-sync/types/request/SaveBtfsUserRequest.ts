import {BaseBtfsRequest} from "./BaseBtfsRequest";
import {BtfsUser} from "../btfs-entities";

export interface SaveBtfsUserRequest extends BaseBtfsRequest {
    userId: string,
    data: BtfsUser
}
