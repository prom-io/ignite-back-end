import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserSubscriptionsRepository} from "./UserSubscriptionsRepository";
import {UserSubscriptionsService} from "./UserSubscriptionsService";
import {UserSubscriptionsMapper} from "./UserSubscriptionsMapper";
import {UserSubscriptionsController} from "./UserSubscriptionsController";
import {UserSubscriptionEntityEventsSubscriber} from "./UserSubscriptionEntityEventsSubscriber";
import {UsersModule, UsersRepository, UserStatisticsRepository} from "../users";

@Module({
    controllers: [UserSubscriptionsController],
    providers: [UserSubscriptionsService, UserSubscriptionsMapper, UserSubscriptionEntityEventsSubscriber],
    imports: [
        TypeOrmModule.forFeature([UserSubscriptionsRepository, UsersRepository, UserStatisticsRepository]),
        forwardRef(() => UsersModule)
    ],
    exports: [UserSubscriptionsService, UserSubscriptionsMapper]
})
export class UserSubscriptionsModule {}
