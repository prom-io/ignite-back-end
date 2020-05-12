import {UserResponse} from "../../../users/types/response";

export interface UserSubscriptionResponse {
    id: string,
    user: UserResponse,
    createdAt: string
}
