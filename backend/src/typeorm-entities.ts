import {User, UserStatistics} from "./users/entities";
import {UserSubscription} from "./user-subscriptions/entities";
import {Status, StatusLike} from "./statuses/entities";
import {MediaAttachment} from "./media-attachments/entities";

export const entities = [
    User,
    UserStatistics,
    UserSubscription,
    Status,
    StatusLike,
    MediaAttachment
];
