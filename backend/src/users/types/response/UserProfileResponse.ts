import {UserResponse} from "./UserResponse";
import {UserStatisticsResponse} from "./UserStatisticsResponse";

export interface UserProfileResponse extends UserResponse {
    stats: UserStatisticsResponse,
    currentUserSubscriptionId?: string,
    createdAt: string
}
