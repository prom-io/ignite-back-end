import {BtfsComment} from "../btfs-entities/BtfsComment";

export interface BtfsCommentsResponse {
    [commentId: string]: BtfsComment
}
