import {UserEntityEventsSubscriber} from "./users/UserEntityEventsSubscriber";
import {StatusEntityEventsSubscriber} from "./statuses/StatusEntityEventsSubscriber";
import {UserSubscriptionEntityEventsSubscriber} from "./user-subscriptions/UserSubscriptionEntityEventsSubscriber";

export const subscribers = [
    UserEntityEventsSubscriber,
    StatusEntityEventsSubscriber,
    UserSubscriptionEntityEventsSubscriber
];
