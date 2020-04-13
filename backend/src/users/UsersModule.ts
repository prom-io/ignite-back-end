import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
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

@Module({
    controllers: [UsersController, UserByAddressController],
    providers: [UsersService, UsersMapper, UserEntityEventsSubscriber, UserStatisticsMapper],
    imports: [
        TypeOrmModule.forFeature([UsersRepository, UserStatisticsRepository, UserSubscriptionsRepository]),
        forwardRef(() => StatusesModule),
        forwardRef(() => UserSubscriptionsModule),
    ],
    exports: [UsersService, UsersMapper]
})
export class UsersModule {}
