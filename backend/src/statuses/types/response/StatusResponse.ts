import {UserResponse} from "../../../users/types/response";

export interface StatusResponse {
    id: string,
    createdAt: string,
    author: UserResponse,
    text: string,
    likesCount: number,
    inReplyTo?: StatusResponse,
    likedByCurrentUser: boolean
}
