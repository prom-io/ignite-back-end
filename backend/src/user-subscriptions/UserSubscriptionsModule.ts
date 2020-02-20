import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserSubscriptionsRepository} from "./UserSubscriptionsRepository";
import {UserSubscriptionsService} from "./UserSubscriptionsService";
import {UserSubscriptionsMapper} from "./UserSubscriptionsMapper";
import {UserSubscriptionsController} from "./UserSubscriptionsController";
import {UserSubscriptionEntityEventsSubscriber} from "./UserSubscriptionEntityEventsSubscriber";
import {UsersModule} from "../users";
import {UsersRepository} from "../users/UsersRepository";
import {UserStatisticsRepository} from "../users/UserStatisticsRepository";

console.log(UserStatisticsRepository);

@Module({
    controllers: [UserSubscriptionsController],
    providers: [UserSubscriptionsService, UserSubscriptionsMapper, UserSubscriptionEntityEventsSubscriber],
    imports: [
        TypeOrmModule.forFeature([UsersRepository, UserStatisticsRepository, UserSubscriptionsRepository]),
        forwardRef(() => UsersModule)
    ],
    exports: [UserSubscriptionsService, UserSubscriptionsMapper]
})
export class UserSubscriptionsModule {}
