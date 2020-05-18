import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserSubscriptionsRepository} from "./UserSubscriptionsRepository";
import {UserSubscriptionsService} from "./UserSubscriptionsService";
import {UserSubscriptionsMapper} from "./UserSubscriptionsMapper";
import {UserSubscriptionsController} from "./UserSubscriptionsController";
import {UserSubscriptionEntityEventsSubscriber} from "./UserSubscriptionEntityEventsSubscriber";
import {UsersModule} from "../users/UsersModule";
import {UsersRepository} from "../users/UsersRepository";
import {UserStatisticsRepository} from "../users/UserStatisticsRepository";
import {MicrobloggingBlockchainApiModule} from "../microblogging-blockchain-api";
import {DefaultAccountProviderModule} from "../default-account-provider/DefaultAccountProviderModule";

@Module({
    controllers: [UserSubscriptionsController],
    providers: [UserSubscriptionsService, UserSubscriptionsMapper, UserSubscriptionEntityEventsSubscriber],
    imports: [
        TypeOrmModule.forFeature([UsersRepository, UserStatisticsRepository, UserSubscriptionsRepository]),
        forwardRef(() => UsersModule),
        MicrobloggingBlockchainApiModule,
        DefaultAccountProviderModule
    ],
    exports: [UserSubscriptionsService, UserSubscriptionsMapper]
})
export class UserSubscriptionsModule {
}
