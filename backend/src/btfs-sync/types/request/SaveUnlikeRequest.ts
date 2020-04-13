import {BaseBtfsRequest} from "./BaseBtfsRequest";
import {BtfsStatusLike} from "../btfs-entities";

export interface SaveUnlikeRequest extends BaseBtfsRequest {
    data: BtfsStatusLike
}
