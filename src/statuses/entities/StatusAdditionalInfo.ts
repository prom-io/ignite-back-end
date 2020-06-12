import {UserStatistics} from "../../users/entities";

export class StatusAdditionalInfo {
    id: string;
    likesCount: number;
    repostsCount: number;
    commentsCount: number;
    likedByCurrentUser: boolean;
    repostedByCurrentUser: boolean;
    currentUserFollowsAuthor: boolean;
    currentUserFollowedByAuthor: boolean;
    commentedByCurrentUser: boolean;
    statusAuthorStatistics: Omit<UserStatistics, "user">
}
