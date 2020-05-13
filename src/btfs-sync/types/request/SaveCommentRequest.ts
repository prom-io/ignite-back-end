import {BaseBtfsRequest} from "./BaseBtfsRequest";
import {BtfsComment} from "../btfs-entities/BtfsComment";

export interface SaveCommentRequest extends BaseBtfsRequest {
    commentId: string,
    postId: string,
    data: BtfsComment
}
