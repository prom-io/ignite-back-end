import {User, UserStatistics} from "./users/entities";
import {UserSubscription} from "./user-subscriptions/entities";
import {Comment, Status, StatusLike} from "./statuses/entities";
import {MediaAttachment} from "./media-attachments/entities";
import {BtfsHash} from "./btfs-sync/entities";

export const entities = [
    User,
    UserStatistics,
    UserSubscription,
    Status,
    StatusLike,
    MediaAttachment,
    BtfsHash,
    Comment
];
