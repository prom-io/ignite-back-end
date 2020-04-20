import {UserEntityEventsSubscriber} from "./users/UserEntityEventsSubscriber";
import {StatusEntityEventsSubscriber} from "./statuses/StatusEntityEventsSubscriber";
import {UserSubscriptionEntityEventsSubscriber} from "./user-subscriptions/UserSubscriptionEntityEventsSubscriber";
import {CommentEntityEventsSubscriber} from "./statuses/CommentEntityEventsSubscriber";

export const subscribers = [
    UserEntityEventsSubscriber,
    StatusEntityEventsSubscriber,
    CommentEntityEventsSubscriber,
    UserSubscriptionEntityEventsSubscriber
];
