import {UserEntityEventsSubscriber} from "./users/UserEntityEventsSubscriber";
import {StatusEntityEventsSubscriber} from "./statuses/StatusEntityEventsSubscriber";
import {UserSubscriptionEntityEventsSubscriber} from "./user-subscriptions/UserSubscriptionEntityEventsSubscriber";
import {StatusLikeEntityEventsSubscriber} from "./statuses/StatusLikeEntityEventsSubscriber";

export const subscribers = [
    UserEntityEventsSubscriber,
    StatusEntityEventsSubscriber,
    StatusLikeEntityEventsSubscriber,
    UserSubscriptionEntityEventsSubscriber,
];
