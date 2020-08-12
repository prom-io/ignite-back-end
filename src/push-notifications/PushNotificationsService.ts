import {Inject, Injectable} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import uuid from "uuid";
import admin from "firebase-admin";
import {serialize} from "class-transformer";
import {UserDevicesRepository} from "./UserDevicesRepository";
import {NotificationsRepository} from "./NotificationsRepository";
import {WebsocketEventsPublisher} from "./WebsocketEventsPublisher";
import {Notification, NotificationType} from "./entities";
import {FirebasePushNotification, StatusLikePushNotification, WebsocketPushNotification} from "./types/response";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {Status, StatusLike, StatusReferenceType} from "../statuses/entities";
import {asyncForEach} from "../utils/async-foreach";
import {StatusesMapper} from "../statuses/StatusesMapper";
import {UsersMapper} from "../users/UsersMapper";
import {asyncMap} from "../utils/async-map";
import {config} from "../config";
import {UserSubscription} from "../user-subscriptions/entities";
import {StatusResponse} from "../statuses/types/response";
import {UserResponse} from "../users/types/response";
import App = admin.app.App;
import Message = admin.messaging.Message;

@Injectable()
export class PushNotificationsService {
    constructor(private readonly userDevicesRepository: UserDevicesRepository,
                private readonly userSubscriptionsRepository: UserSubscriptionsRepository,
                private readonly notificationsRepository: NotificationsRepository,
                private readonly statusesMapper: StatusesMapper,
                private readonly usersMapper: UsersMapper,
                @Inject("firebaseAdmin") private readonly firebaseApp: App | null,
                private readonly websocketEventsPublisher: WebsocketEventsPublisher,
                private readonly log: LoggerService) {
    }

    public async processStatus(status: Status): Promise<void> {
        this.log.info("Processing status in PushNotificationService");
        const statusAuthor = status.author;
        const statusAuthorSubscribers = (await this.userSubscriptionsRepository.findAllBySubscribedToNotReverted(statusAuthor))
            .map(subscription => subscription.subscribedUser);

        const notifications: Array<Notification | null> = await asyncMap(statusAuthorSubscribers, async user => {
            if (status.referredStatus && status.referredStatus.author.id === user.id) {
                // Do not create notification if follower is the author of replied or resposted status so that
                // they don't receive two notifications
                return null;
            }

            const notification: Notification = {
                id: uuid(),
                createdAt: new Date(),
                read: false,
                receiver: user,
                notificationObjectId: status.id,
                type: NotificationType.NEW_STATUS
            };
            this.log.info(`Saving notification about status ${status.id} for user ${user.id} to database`);
            return await this.notificationsRepository.save(notification);
        });

        if (config.ENABLE_FIREBASE_PUSH_NOTIFICATIONS) {
            await asyncForEach(notifications, async notification => {
                if (notification !== null) {
                    const user = notification.receiver;
                    const payload = await this.statusesMapper.toStatusResponseAsync(status, user);
                    const websocketPushNotification: WebsocketPushNotification<StatusResponse> = new WebsocketPushNotification<StatusResponse>({
                        id: notification.id,
                        payload,
                        type: NotificationType.NEW_STATUS,
                        createdAt: notification.createdAt.toISOString(),
                        read: notification.read
                    });
                    this.websocketEventsPublisher.publishWebsocketPushNotification({
                        websocketPushNotification,
                        receiverEthereumAddress: user.ethereumAddress
                    });

                    this.log.debug(`Looking for devices of user ${user.id}`);
                    const userDevices = await this.userDevicesRepository.findByUser(user);

                    await asyncForEach(userDevices, async userDevice => {
                        const pushNotification: FirebasePushNotification = new FirebasePushNotification({
                            id: notification.id,
                            type: NotificationType.NEW_STATUS,
                            jsonPayload: serialize(await this.statusesMapper.toStatusResponseAsync(status, userDevice.user)),
                            createdAt: notification.createdAt.toISOString()
                        });
                        const message: Message = {
                            token: userDevice.fcmToken,
                            data: {
                                ...JSON.parse(serialize(pushNotification))
                            }
                        };
                        this.log.debug(`Sending push notification for user ${user.id} to device with FCM token ${userDevice.fcmToken}`);
                        try {
                            await this.firebaseApp!.messaging().send(message);
                        } catch (error) {
                            if (error.code === "messaging/registration-token-not-registered") {
                                this.log.debug(`FCM token ${userDevice.fcmToken} is expired`);
                                userDevice.fcmTokenExpired = true;
                                await this.userDevicesRepository.save(userDevice);
                            } else {
                                this.log.error(`Error occurred when tried to send push notification to device with FCM token ${userDevice.fcmToken}`);
                                this.log.error(error.message);
                            }
                        }
                    })
                }
            });
        }

        if (status.referredStatus && status.author.id !== status.referredStatus.author.id) {
            const referredStatusAuthor = status.referredStatus.author;
            const referredStatusAuthorDevices = await this.userDevicesRepository.findByUser(referredStatusAuthor);

            const notification: Notification = {
                id: uuid(),
                receiver: referredStatusAuthor,
                type: status.statusReferenceType === StatusReferenceType.COMMENT
                    ? NotificationType.STATUS_REPLY
                    : NotificationType.REPOST,
                notificationObjectId: status.id,
                read: false,
                createdAt: new Date()
            };
            this.log.info(`Saving notification about reply to status ${status.referredStatus.id}`);
            await this.notificationsRepository.save(notification);

            if (config.ENABLE_FIREBASE_PUSH_NOTIFICATIONS) {
                const payload = await this.statusesMapper.toStatusResponseAsync(status, notification.receiver);
                const websocketPushNotification: WebsocketPushNotification<StatusResponse> = new WebsocketPushNotification<StatusResponse>({
                    id: notification.id,
                    type: notification.type,
                    payload,
                    createdAt: notification.createdAt.toISOString(),
                    read: notification.read
                });
                this.websocketEventsPublisher.publishWebsocketPushNotification({
                    receiverEthereumAddress: notification.receiver.ethereumAddress,
                    websocketPushNotification
                });
                await asyncForEach(referredStatusAuthorDevices, async device => {
                    const pushNotification = new FirebasePushNotification({
                        id: notification.id,
                        type: NotificationType.STATUS_REPLY,
                        jsonPayload: serialize(payload),
                        createdAt: notification.createdAt.toISOString()
                    });
                    const message: Message = {
                        token: device.fcmToken,
                        data: {
                            ...JSON.parse(serialize(pushNotification))
                        }
                    };
                    this.log.debug(`Sending push notification about status reply for user ${device.user.id} to device with FCM token ${device.fcmToken}`);
                    await this.firebaseApp.messaging().send(message);
                })
            }
        }

    }

    public async processStatusLike(statusLike: StatusLike): Promise<void> {
        const statusLikeReceiver = statusLike.status.author;

        if (statusLike.user.id === statusLikeReceiver.id) {
            // Do not create a notification if user liked their own status
            return ;
        }

        const notification: Notification = {
            id: uuid(),
            createdAt: new Date(),
            read: false,
            notificationObjectId: statusLike.id,
            type: NotificationType.STATUS_LIKE,
            receiver: statusLikeReceiver
        };
        await this.notificationsRepository.save(notification);

        if (config.ENABLE_FIREBASE_PUSH_NOTIFICATIONS) {
            const statusLikeReceiverDevices = await this.userDevicesRepository.findByUser(statusLikeReceiver);
            const likedBy = this.usersMapper.toUserResponse(statusLike.user);
            const likedStatus = await this.statusesMapper.toStatusResponseAsync(statusLike.status);

            const payload = new StatusLikePushNotification({
                likedBy,
                likedStatus
            });
            const websocketPushNotification: WebsocketPushNotification<StatusLikePushNotification> =
                new WebsocketPushNotification<StatusLikePushNotification>({
                    id: notification.id,
                    payload,
                    type: NotificationType.STATUS_LIKE,
                    createdAt: notification.createdAt.toISOString(),
                    read: notification.read
                });
            this.websocketEventsPublisher.publishWebsocketPushNotification({
                receiverEthereumAddress: notification.receiver.ethereumAddress,
                websocketPushNotification
            });

            await asyncForEach(statusLikeReceiverDevices, async device => {
                const pushNotification = new FirebasePushNotification({
                    id: notification.id,
                    type: NotificationType.STATUS_LIKE,
                    jsonPayload: serialize(payload),
                    createdAt: notification.createdAt.toISOString()
                });
                const message: Message = {
                    token: device.fcmToken,
                    data: {
                        ...JSON.parse(serialize(pushNotification))
                    }
                };
                await this.firebaseApp.messaging().send(message);
            })
        }
    }

    public async processUserSubscription(userSubscription: UserSubscription): Promise<void> {
        const receiver = userSubscription.subscribedTo;

        const notification: Notification = {
            id: uuid(),
            createdAt: new Date(),
            receiver,
            read: false,
            notificationObjectId: userSubscription.id,
            type: NotificationType.FOLLOW
        };
        await this.notificationsRepository.save(notification);

        if (config.ENABLE_FIREBASE_PUSH_NOTIFICATIONS) {
            const payload = this.usersMapper.toUserResponse(userSubscription.subscribedUser);
            const websocketPushNotification: WebsocketPushNotification<UserResponse> = new WebsocketPushNotification<UserResponse>({
                id: notification.id,
                payload,
                type: NotificationType.FOLLOW,
                createdAt: notification.createdAt.toISOString(),
                read: notification.read
            });
            this.websocketEventsPublisher.publishWebsocketPushNotification({
                receiverEthereumAddress: notification.receiver.ethereumAddress,
                websocketPushNotification
            });

            const notificationReceiverDevices = await this.userDevicesRepository.findByUser(notification.receiver);

            await asyncForEach(notificationReceiverDevices, async userDevice => {
                const pushNotification = new FirebasePushNotification({
                    id: notification.id,
                    jsonPayload: serialize(payload),
                    type: NotificationType.FOLLOW,
                    createdAt: notification.createdAt.toISOString()
                });
                const message: Message = {
                    token: userDevice.fcmToken,
                    data: {
                        ...JSON.parse(serialize(pushNotification))
                    }
                };
                await this.firebaseApp.messaging().send(message);
            })
        }
    }
}
