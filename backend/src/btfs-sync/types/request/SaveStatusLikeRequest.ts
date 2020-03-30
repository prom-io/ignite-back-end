import {BtfsStatusLike} from "../btfs-entities";

export interface SaveStatusLikeRequest {
    id: string,
    statusId: string,
    data: BtfsStatusLike
}
