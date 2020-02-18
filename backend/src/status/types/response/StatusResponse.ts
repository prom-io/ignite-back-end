import {UserResponse} from "../../../users/types/response/UserResponse";

export interface StatusResponse {
    id: string,
    createdAt: string,
    author: UserResponse,
    text: string,
    likesCount: number,
    inReplyTo?: StatusResponse
}
