import {UserEntityEventsSubscriber} from "./users/UserEntityEventsSubscriber";
import {StatusEntityEventsSubscriber} from "./statuses/StatusEntityEventsSubscriber";
import {UserSubscriptionEntityEventsSubscriber} from "./user-subscriptions/UserSubscriptionEntityEventsSubscriber";
import {StatusLikeEntityEventsSubscriber} from "./statuses/StatusLikeEntityEventsSubscriber";
import {NotificationEntityEventsSubscriber} from "./push-notifications/NotificationEntityEventsSubscriber";

export const subscribers = [
    UserEntityEventsSubscriber,
    StatusEntityEventsSubscriber,
    StatusLikeEntityEventsSubscriber,
    UserSubscriptionEntityEventsSubscriber,
    NotificationEntityEventsSubscriber
];
