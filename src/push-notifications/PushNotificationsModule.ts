import {forwardRef, Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import FirebaseAdmin from "firebase-admin";
import {UserDevicesController} from "./UserDevicesController";
import {PushNotificationsService} from "./PushNotificationsService";
import {UserDevicesService} from "./UserDevicesService";
import {WebsocketEventsPublisher} from "./WebsocketEventsPublisher";
import {NotificationsService} from "./NotificationsService";
import {NotificationsController} from "./NotificationsController";
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
    controllers: [UserDevicesController, NotificationsController],
    providers: [
        {
            provide: "firebaseAdmin",
            useFactory: () => {
                if (config.ENABLE_FIREBASE_PUSH_NOTIFICATIONS && config.additionalConfig.firebase) {
                    return FirebaseAdmin.initializeApp({
                        credential: FirebaseAdmin.credential.cert(config.additionalConfig.firebase as any)
                    })
                } else {
                    return null;
                }
            }
        },
        PushNotificationsService,
        UserDevicesService,
        NotificationsService,
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
