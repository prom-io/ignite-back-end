import {BaseBtfsRequest} from "./BaseBtfsRequest";
import {BtfsStatusLike} from "../btfs-entities";

export interface SaveStatusLikeRequest extends BaseBtfsRequest {
    commentId: string,
    data: BtfsStatusLike
}
