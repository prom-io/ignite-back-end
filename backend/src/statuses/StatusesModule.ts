import {forwardRef, Module} from "@nestjs/common";
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
import {StatusLikeEntityEventsListener} from "./StatusLikeEntityEventsListener";
import {UsersModule, UsersRepository, UserStatisticsRepository} from "../users";
import {UserSubscriptionsModule, UserSubscriptionsRepository} from "../user-subscriptions";
import {MicrobloggingBlockchainApiModule} from "../microblogging-blockchain-api";

@Module({
    controllers: [StatusesController, TimelineController],
    providers: [
        StatusesService,
        StatusesMapper,
        StatusLikesService,
        FeedService,
        StatusEntityEventsSubscriber,
        StatusLikeEntityEventsListener
    ],
    imports: [
        TypeOrmModule.forFeature([
            StatusesRepository,
            StatusLikesRepository,
            UsersRepository,
            UserSubscriptionsRepository,
            UserStatisticsRepository
        ]),
        forwardRef(() => UsersModule),
        UserSubscriptionsModule,
        MicrobloggingBlockchainApiModule
    ],
    exports: [StatusesService, StatusesMapper]
})
export class StatusesModule {}
