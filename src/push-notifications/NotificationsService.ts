import {Injectable} from "@nestjs/common";
import {NotificationsRepository} from "./NotificationsRepository";
import {NotificationsMapper} from "./NotificationsMapper";
import {User} from "../users/entities";
import {WebsocketPushNotification} from "./types/response";
import {asyncMap} from "../utils/async-map";
import {MarkNotificationsReadRequest} from "./types/request";

@Injectable()
export class NotificationsService {
    constructor(private readonly notificationsRepository: NotificationsRepository,
                private readonly notificationsMapper: NotificationsMapper) {
    }

    public async getNotReadNotificationsOfCurrentUser(currentUser: User): Promise<Array<WebsocketPushNotification<any>>> {
        const notReadNotifications = await this.notificationsRepository.findNotReadByReceiver(currentUser);
        return await asyncMap(
            notReadNotifications,
            async notification => await this.notificationsMapper.toWebsocketNotificationResponse(notification)
        );
    }

    public async markNotificationsAsRead(markNotificationsReadRequest: MarkNotificationsReadRequest,
                                         currentUser: User): Promise<Array<WebsocketPushNotification<any>>> {
        let notifications = (await this.notificationsRepository.findAllById(markNotificationsReadRequest.notificationsIds))
            .filter(notification => notification.receiver.id === currentUser.id);
        notifications = notifications.map(notification => ({
            ...notification,
            read: true
        }));
        notifications = await this.notificationsRepository.save(notifications);

        return await asyncMap(
            notifications,
            async notification => await this.notificationsMapper.toWebsocketNotificationResponse(notification)
        )
    }
}
