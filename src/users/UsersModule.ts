import {BadRequestException, forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MailerModule} from "@nestjs-modules/mailer";
import {UsersService} from "./UsersService";
import {UsersMapper} from "./UsersMapper";
import {UsersController} from "./UsersController";
import {SignUpController} from "./SignUpController";
import {UserByAddressController} from "./UserByAddressController";
import {UsersRepository} from "./UsersRepository";
import {UserStatisticsRepository} from "./UserStatisticsRepository";
import {UserEntityEventsSubscriber} from "./UserEntityEventsSubscriber";
import {UserStatisticsMapper} from "./UserStatisticsMapper";
import {UserPreferencesRepository} from "./UserPreferencesRepository";
import {SignUpReferencesController} from "./SignUpReferencesController";
import {SignUpReferencesService} from "./SignUpReferencesService";
import {SignUpReferencesMapper} from "./SignUpReferencesMapper";
import {SignUpReferencesRepository} from "./SignUpReferencesRepository";
import {StatusesModule} from "../statuses/StatusesModule";
import {UserSubscriptionsModule} from "../user-subscriptions/UserSubscriptionsModule";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {config} from "../config";
import {DefaultAccountProviderModule} from "../default-account-provider/DefaultAccountProviderModule";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {PasswordHashApiModule} from "../password-hash-api";
import { StatusLikesRepository } from "../statuses/StatusLikesRepository";
import { StatusesRepository } from "../statuses/StatusesRepository";
import { TransactionsRepository } from "../transactions/TransactionsRepository";
import { TokenExchangeModule } from "../token-exchange";
import { GoogleRecaptchaModule } from "@nestlab/google-recaptcha";

@Module({
    controllers: [UsersController, UserByAddressController, SignUpController, SignUpReferencesController],
    providers: [
        UsersService,
        UsersMapper,
        UserEntityEventsSubscriber,
        UserStatisticsMapper,
        SignUpReferencesService,
        SignUpReferencesMapper
    ],
    imports: [
        TypeOrmModule.forFeature([
            UsersRepository,
            StatusLikesRepository,
            StatusesRepository,
            UserStatisticsRepository,
            UserSubscriptionsRepository,
            MediaAttachmentsRepository,
            UserPreferencesRepository,
            SignUpReferencesRepository,
            TransactionsRepository,
        ]),
        TokenExchangeModule,
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
        GoogleRecaptchaModule.forRoot({
            secretKey: config.GOOGLE_RECAPTCHA_SECRET_KEY,
            response: req => req.headers["x-recaptcha"],
            skipIf: req => config.NODE_ENV !== "production" || config.additionalConfig.disableGoogleRecaptchaForSignUp === true,
            onError: () => {
                throw new BadRequestException("Invalid recaptcha.")
            }
        }),
        DefaultAccountProviderModule,
        PasswordHashApiModule
    ],
    exports: [UsersService, UsersMapper]
})
export class UsersModule {
}
