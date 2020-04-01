import {BtfsStatusLike} from "../btfs-entities";

export interface SaveStatusLikeRequest {
    id: string,
    commentId: string,
    data: BtfsStatusLike
}
