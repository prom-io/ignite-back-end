import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TimelineController} from "./TimelineController";
import {FeedService} from "./FeedService";
import {StatusesController} from "./StatusesController";
import {StatusesService} from "./StatusesService";
import {StatusesMapper} from "./StatusesMapper";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {CommentsRepository} from "./CommentsRepository";
import {StatusLikesService} from "./StatusLikesService";
import {StatusEntityEventsSubscriber} from "./StatusEntityEventsSubscriber";
import {StatusLikeEntityEventsListener} from "./StatusLikeEntityEventsListener";
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
import {CommentsService} from "./CommentsService";
import {CommentsMapper} from "./CommentsMapper";

@Module({
    controllers: [StatusesController, TimelineController],
    providers: [
        StatusesService,
        StatusesMapper,
        StatusLikesService,
        FeedService,
        StatusEntityEventsSubscriber,
        StatusLikeEntityEventsListener,
        StatusMappingOptionsProvider,
        CommentsService,
        CommentsMapper
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
            CommentsRepository
        ]),
        UserSubscriptionsModule,
        MicrobloggingBlockchainApiModule,
        MediaAttachmentsModule,
        DefaultAccountProviderModule,
        forwardRef(() => UsersModule)
    ],
    exports: [StatusesService, StatusesMapper]
})
export class StatusesModule {}
