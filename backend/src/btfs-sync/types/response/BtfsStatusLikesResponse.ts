import {BtfsStatusLike} from "../btfs-entities";

export interface BtfsStatusLikesResponse {
    [likeId: string]: BtfsStatusLike
}
