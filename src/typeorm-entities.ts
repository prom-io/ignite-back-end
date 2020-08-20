import {User, UserPreferences, UserStatistics, SignUpReference} from "./users/entities";
import {UserSubscription} from "./user-subscriptions/entities";
import {HashTag, HashTagSubscription, Status, StatusLike} from "./statuses/entities";
import {MediaAttachment} from "./media-attachments/entities";
import {BtfsHash} from "./btfs-sync/entities";
import {Notification, UserDevice} from "./push-notifications/entities";
import {MemezatorContestResult} from "./memezator/entities/MemezatorContestResult";
import { Transaction } from "./transactions/entities/Transaction";

export const entities = [
    User,
    UserStatistics,
    UserSubscription,
    Status,
    StatusLike,
    MediaAttachment,
    BtfsHash,
    UserPreferences,
    UserDevice,
    Notification,
    HashTag,
    HashTagSubscription,
    SignUpReference,
    MemezatorContestResult,
    Transaction,
];
