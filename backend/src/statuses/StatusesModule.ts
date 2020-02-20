import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {FeedController} from "./FeedController";
import {FeedService} from "./FeedService";
import {StatusesController} from "./StatusesController";
import {StatusesService} from "./StatusesService";
import {StatusesMapper} from "./StatusesMapper";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {StatusLikesService} from "./StatusLikesService";
import {StatusEntityEventsSubscriber} from "./StatusEntityEventsSubscriber";
import {UsersModule, UsersRepository, UserStatisticsRepository} from "../users";
import {UserSubscriptionsModule, UserSubscriptionsRepository} from "../user-subscriptions";

@Module({
    controllers: [StatusesController, FeedController],
    providers: [StatusesService, StatusesMapper, StatusLikesService, FeedService, StatusEntityEventsSubscriber],
    imports: [
        TypeOrmModule.forFeature([StatusesRepository, StatusLikesRepository, UsersRepository, UserSubscriptionsRepository, UserStatisticsRepository]),
        forwardRef(() => UsersModule),
        UserSubscriptionsModule
    ],
    exports: [StatusesService, StatusesMapper]
})
export class StatusesModule {}
