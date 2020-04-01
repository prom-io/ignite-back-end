import {BtfsStatus} from "./BtfsStatus";
import {BtfsUser} from "./BtfsUser";

export interface BtfsStatusLike {
    id: string,
    status: BtfsStatus
    user: BtfsUser,
    createdAt: string
}
