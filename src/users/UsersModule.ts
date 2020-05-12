import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MailerModule} from "@nestjs-modules/mailer";
import {UsersService} from "./UsersService";
import {UsersMapper} from "./UsersMapper";
import {UsersController} from "./UsersController";
import {UserByAddressController} from "./UserByAddressController";
import {UsersRepository} from "./UsersRepository";
import {UserStatisticsRepository} from "./UserStatisticsRepository";
import {UserEntityEventsSubscriber} from "./UserEntityEventsSubscriber";
import {UserStatisticsMapper} from "./UserStatisticsMapper";
import {StatusesModule} from "../statuses/StatusesModule";
import {UserSubscriptionsModule} from "../user-subscriptions/UserSubscriptionsModule";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {config} from "../config";
import {DefaultAccountProviderModule} from "../default-account-provider/DefaultAccountProviderModule";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";

@Module({
    controllers: [UsersController, UserByAddressController],
    providers: [UsersService, UsersMapper, UserEntityEventsSubscriber, UserStatisticsMapper],
    imports: [
        TypeOrmModule.forFeature([UsersRepository, UserStatisticsRepository, UserSubscriptionsRepository, MediaAttachmentsRepository]),
        forwardRef(() => StatusesModule),
        forwardRef(() => UserSubscriptionsModule),
        MailerModule.forRoot({
            transport: {
                port: config.EMAIL_SMTP_SERVER_PORT,
                host: config.EMAIL_SMTP_SERVER_HOST,
                auth: {
                    user: config.EMAIL_USERNAME,
                    pass: config.EMAIL_PASSWORD
                },
                secure: true
            },
        }),
        DefaultAccountProviderModule
    ],
    exports: [UsersService, UsersMapper]
})
export class UsersModule {}
