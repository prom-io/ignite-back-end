import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {NotificationsRepository} from "./NotificationsRepository";
import {NotificationsMapper} from "./NotificationsMapper";
import {Notification} from "./entities";
import {MarkNotificationsReadRequest} from "./types/request";
import {WebsocketPushNotification} from "./types/response";
import {User} from "../users/entities";
import {asyncMap} from "../utils/async-map";
import {FeedCursors} from "../statuses/types/request/FeedCursors";
import {PaginationRequest} from "../utils/pagination";

@Injectable()
export class NotificationsService {
    constructor(private readonly notificationsRepository: NotificationsRepository,
                private readonly notificationsMapper: NotificationsMapper) {
    }

    public async getAllNotificationsOfCurrentUser(currentUser: User, cursors: FeedCursors): Promise<Array<WebsocketPushNotification<any>>> {
        let notifications: Notification[];
        const paginationRequest: PaginationRequest = {
            page: 1,
            pageSize: 30
        };

        if (cursors.maxId) {
            if (cursors.sinceId) {
                const sinceCursor = await this.findNotificationById(cursors.sinceId);
                const maxCursor = await this.findNotificationById(cursors.maxId);

                notifications = await this.notificationsRepository.findByReceiverAndCreatedAtBetween(
                    currentUser,
                    sinceCursor.createdAt,
                    maxCursor.createdAt,
                    paginationRequest
                );
            } else {
                const maxCursor = await this.findNotificationById(cursors.maxId);

                notifications = await this.notificationsRepository.findByReceiverAndCreatedAtBefore(
                    currentUser,
                    maxCursor.createdAt,
                    paginationRequest
                );
            }
        } else if (cursors.sinceId) {
            const sinceCursor = await this.findNotificationById(cursors.sinceId);

            notifications = await this.notificationsRepository.findByReceiverAndCreatedAtAfter(
                currentUser,
                sinceCursor.createdAt,
                paginationRequest
            );
        } else {
            notifications = await this.notificationsRepository.findByReceiver(currentUser, paginationRequest);
        }

        return await asyncMap(
            notifications,
            async notification => await this.notificationsMapper.toWebsocketNotificationResponse(notification)
        );
    }

    public async getNotReadNotificationsOfCurrentUser(currentUser: User, feedCursors: FeedCursors): Promise<Array<WebsocketPushNotification<any>>> {
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

    private async findNotificationById(id: string): Promise<Notification> {
        const notification = await this.notificationsRepository.findById(id);

        if (notification === null) {
            throw new HttpException(
                `Could not find notification with id ${id}`,
                HttpStatus.NOT_FOUND
            );
        }

        return notification;
    }
}
