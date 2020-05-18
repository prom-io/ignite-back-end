import {forwardRef, Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import FirebaseAdmin from "firebase-admin";
import {UserDevicesController} from "./UserDevicesController";
import {PushNotificationsService} from "./PushNotificationsService";
import {UserDevicesService} from "./UserDevicesService";
import {NotificationEntityEventsSubscriber} from "./NotificationEntityEventsSubscriber";
import {WebsocketEventsPublisher} from "./WebsocketEventsPublisher";
import {NotificationsMapper} from "./NotificationsMapper";
import {StatusesModule} from "../statuses";
import {UsersModule, UsersRepository} from "../users";
import {TypeOrmModule} from "@nestjs/typeorm";
import {NotificationsRepository} from "./NotificationsRepository";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {StatusesRepository} from "../statuses/StatusesRepository";
import {UserDevicesRepository} from "./UserDevicesRepository";
import {config} from "../config";
import {StatusLikesRepository} from "../statuses/StatusLikesRepository";

@Module({
    controllers: [UserDevicesController],
    providers: [
        {
            provide: "firebaseAdmin",
            useFactory: () => {
                if (config.ENABLE_FIREBASE_PUSH_NOTIFICATIONS) {
                    const firebaseConfig = require("../../firebase-config.json");
                    return FirebaseAdmin.initializeApp({
                        credential: FirebaseAdmin.credential.cert(firebaseConfig)
                    })
                } else {
                    return null;
                }
            }
        },
        PushNotificationsService,
        UserDevicesService,
        NotificationEntityEventsSubscriber,
        NotificationsMapper,
        WebsocketEventsPublisher
    ],
    imports: [
        forwardRef(() => StatusesModule),
        forwardRef(() => UsersModule),
        TypeOrmModule.forFeature([
            NotificationsRepository,
            UsersRepository,
            UserSubscriptionsRepository,
            StatusesRepository,
            UserDevicesRepository,
            StatusLikesRepository
        ]),
        JwtModule.register({
            secret: config.JWT_SECRET
        })
    ],
    exports: [PushNotificationsService]
})
export class PushNotificationsModule {
}
