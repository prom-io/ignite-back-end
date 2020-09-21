import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import {forwardRef, Module, BadRequestException, Logger} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TimelineController} from "./TimelineController";
import {FeedService} from "./FeedService";
import {StatusesController} from "./StatusesController";
import {StatusesService} from "./StatusesService";
import {StatusesMapper} from "./StatusesMapper";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {StatusLikesService} from "./StatusLikesService";
import {StatusEntityEventsSubscriber} from "./StatusEntityEventsSubscriber";
import {StatusLikeEntityEventsSubscriber} from "./StatusLikeEntityEventsSubscriber";
import {StatusMappingOptionsProvider} from "./StatusMappingOptionsProvider";
import {UsersRepository, UserStatisticsRepository} from "../users";
import {UsersModule} from "../users/UsersModule";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {UserSubscriptionsModule} from "../user-subscriptions/UserSubscriptionsModule";
import {MicrobloggingBlockchainApiModule} from "../microblogging-blockchain-api";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {MediaAttachmentsModule} from "../media-attachments";
import {DefaultAccountProviderModule} from "../default-account-provider/DefaultAccountProviderModule";
import {BtfsHashRepository} from "../btfs-sync/BtfsHashRepository";
import {PushNotificationsModule} from "../push-notifications/PushNotificationsModule";
import {HashTagsRepository} from "./HashTagsRepository";
import {HashTagsRetriever} from "./HashTagsRetriever";
import {TopicsController} from "./TopicsController";
import {TopicsService} from "./TopicsService";
import {HashTagsMapper} from "./HashTagsMapper";
import {HashTagSubscriptionsRepository} from "./HashTagSubscriptionsRepository";
import { config } from '../config';

@Module({
    controllers: [StatusesController, TimelineController, TopicsController],
    providers: [
        StatusesService,
        StatusesMapper,
        StatusLikesService,
        FeedService,
        StatusEntityEventsSubscriber,
        StatusLikeEntityEventsSubscriber,
        StatusMappingOptionsProvider,
        HashTagsRetriever,
        TopicsService,
        HashTagsMapper
    ],
    imports: [
        TypeOrmModule.forFeature([
            StatusesRepository,
            StatusLikesRepository,
            UsersRepository,
            UserSubscriptionsRepository,
            UserStatisticsRepository,
            MediaAttachmentsRepository,
            BtfsHashRepository,
            HashTagsRepository,
            HashTagSubscriptionsRepository
        ]),
        GoogleRecaptchaModule.forRoot({
            secretKey: config.GOOGLE_RECAPTCHA_SECRET_KEY,
            response: req => req.headers["x-recaptcha"],
            skipIf: req => {
                Logger.log(req.body)
               return config.NODE_ENV === 'production' && req.body.fromMemezator !== true
            },
            onError: () => {
                throw new BadRequestException('Invalid recaptcha.')
            }
        }),
        UserSubscriptionsModule,
        MicrobloggingBlockchainApiModule,
        MediaAttachmentsModule,
        DefaultAccountProviderModule,
        forwardRef(() => UsersModule),
        forwardRef(() => PushNotificationsModule)
    ],
    exports: [StatusesService, StatusesMapper, HashTagsRetriever, StatusLikesService]
})
export class StatusesModule {
}
