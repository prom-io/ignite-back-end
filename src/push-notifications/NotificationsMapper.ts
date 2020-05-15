import {Injectable} from "@nestjs/common";
import {Notification, NotificationType} from "./entities";
import {StatusLikePushNotification, WebsocketPushNotification} from "./types/response";
import {StatusesRepository} from "../statuses/StatusesRepository";
import {StatusLikesRepository} from "../statuses/StatusLikesRepository";
import {StatusesMapper} from "../statuses";
import {StatusResponse} from "../statuses/types/response";
import {UsersMapper} from "../users/UsersMapper";

@Injectable()
export class NotificationsMapper {
    constructor(private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly statusesMapper: StatusesMapper,
                private readonly usersMapper: UsersMapper) {
    }

    public async toWebsocketNotificationResponse(notification: Notification): Promise<WebsocketPushNotification<any>> {
        switch (notification.type) {
            case NotificationType.STATUS_REPLY:
            case NotificationType.NEW_STATUS: {
                const status = await this.statusesRepository.findById(notification.notificationObjectId);
                return new WebsocketPushNotification<StatusResponse>({
                    id: notification.id,
                    payload: await this.statusesMapper.toStatusResponseAsync(status, notification.receiver),
                    type: notification.type
                });
            }
            case NotificationType.STATUS_LIKE: {
                const statusLike = await this.statusLikesRepository.findById(notification.notificationObjectId);
                const statusLikePushNotification: StatusLikePushNotification = new StatusLikePushNotification({
                    likedStatus: await this.statusesMapper.toStatusResponseAsync(statusLike.status, notification.receiver),
                    likedBy: this.usersMapper.toUserResponse(statusLike.user)
                });
                return new WebsocketPushNotification<StatusLikePushNotification>({
                    id: notification.id,
                    type: NotificationType.STATUS_LIKE,
                    payload: statusLikePushNotification
                });
            }
        }
    }
}
