import {Injectable} from "@nestjs/common";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection, EntitySubscriberInterface, InsertEvent} from "typeorm";
import {Notification} from "./entities";
import {NotificationsMapper} from "./NotificationsMapper";
import {WebsocketEventsPublisher} from "./WebsocketEventsPublisher";

@Injectable()
export class NotificationEntityEventsSubscriber implements EntitySubscriberInterface<Notification> {
    constructor(@InjectConnection() private readonly connection: Connection,
                private readonly notificationsMapper: NotificationsMapper,
                private readonly websocketEventsPublisher: WebsocketEventsPublisher) {
        connection.subscribers.push(this);
    }

    public afterInsert(event: InsertEvent<Notification>): void {
        const notification = event.entity;
        this.notificationsMapper.toWebsocketNotificationResponse(notification)
            .then(websocketPushNotification => this.websocketEventsPublisher.publishWebsocketPushNotification({
                receiverEthereumAddress: notification.receiver.ethereumAddress,
                websocketPushNotification
            }));
    }

    // tslint:disable-next-line:ban-types
    public listenTo(): Function  {
        return Notification;
    }
}
