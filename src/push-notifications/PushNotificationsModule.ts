import {forwardRef, Module} from "@nestjs/common";
import FirebaseAdmin from "firebase-admin";
import {UserDevicesController} from "./UserDevicesController";
import {PushNotificationsService} from "./PushNotificationsService";
import {UserDevicesService} from "./UserDevicesService";
import {StatusesModule} from "../statuses";
import {UsersModule, UsersRepository} from "../users";
import {TypeOrmModule} from "@nestjs/typeorm";
import {NotificationsRepository} from "./NotificationsRepository";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {StatusesRepository} from "../statuses/StatusesRepository";
import {UserDevicesRepository} from "./UserDevicesRepository";

// tslint:disable-next-line:no-var-requires
const firebaseConfig = require("../../firebase-config.json");

@Module({
    controllers: [UserDevicesController],
    providers: [
        {
            provide: "firebaseAdmin",
            useValue: () => {
                return FirebaseAdmin.initializeApp({
                    credential: FirebaseAdmin.credential.cert(firebaseConfig)
                });
            }
        },
        PushNotificationsService,
        UserDevicesService
    ],
    imports: [
        forwardRef(() => StatusesModule),
        UsersModule,
        TypeOrmModule.forFeature([
            NotificationsRepository,
            UsersRepository,
            UserSubscriptionsRepository,
            StatusesRepository,
            UserDevicesRepository
        ])
    ],
    exports: [PushNotificationsService]
})
export class PushNotificationsModule {
}
