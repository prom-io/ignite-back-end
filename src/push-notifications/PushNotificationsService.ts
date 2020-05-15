import {Inject, Injectable} from "@nestjs/common";
import admin from "firebase-admin";
import {UserDevicesRepository} from "./UserDevicesRepository";
import {NotificationsRepository} from "./NotificationsRepository";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {Status, StatusLike, StatusReferenceType} from "../statuses/entities";
import {asyncForEach} from "../utils/async-foreach";
import {FirebasePushNotification, NotificationType, StatusLikePushNotification} from "./types/response";
import {StatusesMapper} from "../statuses";
import {UsersMapper} from "../users/UsersMapper";
import {Notification} from "./entities";
import uuid from "uuid";
import {asyncMap} from "../utils/async-map";
import App = admin.app.App;
import Message = admin.messaging.Message;

@Injectable()
export class PushNotificationsService {
    constructor(private readonly userDevicesRepository: UserDevicesRepository,
                private readonly userSubscriptionsRepository: UserSubscriptionsRepository,
                private readonly notificationsRepository: NotificationsRepository,
                private readonly statusesMapper: StatusesMapper,
                private readonly usersMapper: UsersMapper,
                @Inject("firebaseAdmin") private readonly firebaseApp: App) {
    }

    public async processStatus(status: Status): Promise<void> {
        const statusAuthor = status.author;
        const statusAuthorSubscribers = (await this.userSubscriptionsRepository.findAllBySubscribedToNotReverted(statusAuthor))
            .map(subscription => subscription.subscribedUser);

        const notifications = await asyncMap(statusAuthorSubscribers, async user => {
            const notification: Notification = {
                id: uuid(),
                createdAt: new Date(),
                read: false,
                receiver: user,
                notificationObjectId: status.id,
                type: NotificationType.NEW_STATUS
            };
            return await this.notificationsRepository.save(notification);
        });

        await asyncForEach(notifications, async notification => {
            const user = notification.receiver;
            const userDevices = await this.userDevicesRepository.findByUser(user);

            await asyncForEach(userDevices, async userDevice => {
                const pushNotification: FirebasePushNotification = {
                    id: notification.id,
                    type: NotificationType.NEW_STATUS,
                    jsonPayload: JSON.stringify(await this.statusesMapper.toStatusResponseAsync(status, userDevice.user))
                };
                const message: Message = {
                    token: userDevice.fcmToken,
                    data: {
                        ...pushNotification
                    }
                };
                await this.firebaseApp.messaging().send(message);
            })
        });

        if (status.referredStatus !== null && status.statusReferenceType === StatusReferenceType.COMMENT) {
            const referredStatusAuthor = status.referredStatus.author;
            const referredStatusAuthorDevices = await this.userDevicesRepository.findByUser(referredStatusAuthor);

            const notification: Notification = {
                id: uuid(),
                receiver: referredStatusAuthor,
                type: NotificationType.STATUS_REPLY,
                notificationObjectId: status.id,
                read: false,
                createdAt: new Date()
            };
            await this.notificationsRepository.save(notification);

            await asyncForEach(referredStatusAuthorDevices, async device => {
                const pushNotification = new FirebasePushNotification({
                    id: notification.id,
                    type: NotificationType.STATUS_REPLY,
                    jsonPayload: JSON.stringify(await this.statusesMapper.toStatusResponseAsync(status, device.user))
                });
                const message: Message = {
                    token: device.fcmToken,
                    data: {
                        ...pushNotification
                    }
                };
                await this.firebaseApp.messaging().send(message);
            })
        }

    }

    public async processStatusLike(statusLike: StatusLike): Promise<void> {
        const statusLikeReceiver = statusLike.status.author;
        const statusLikeReceiverDevices = await this.userDevicesRepository.findByUser(statusLikeReceiver);

        const notification: Notification = {
            id: uuid(),
            createdAt: new Date(),
            read: false,
            notificationObjectId: statusLike.id,
            type: NotificationType.STATUS_LIKE,
            receiver: statusLikeReceiver
        };
        await this.notificationsRepository.save(notification);

        const likedBy = this.usersMapper.toUserResponse(statusLike.user);

        await asyncForEach(statusLikeReceiverDevices, async device => {
            const likedStatus = await this.statusesMapper.toStatusResponseAsync(statusLike.status);
            const statusLikePushNotification = new StatusLikePushNotification({
                likedBy,
                likedStatus
            });
            const pushNotification = new FirebasePushNotification({
                id: notification.id,
                type: NotificationType.STATUS_LIKE,
                jsonPayload: JSON.stringify(statusLikePushNotification)
            });
            const message: Message = {
                token: device.fcmToken,
                data: {
                    ...pushNotification
                }
            };
            await this.firebaseApp.messaging().send(message);
        })
    }
}
