import {UserResponse} from "../../../users/types/response";
import {StatusResponse} from "../../../statuses/types/response";
import {BtfsStatus} from "../btfs-entities";

export interface SaveStatusRequest {
    id: string,
    data: BtfsStatus
}
