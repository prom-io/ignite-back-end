import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import axios from "axios";
import {StatisticsController} from "./StatisticsController";
import {StatisticsService} from "./StatisticsService";
import {StatusesRepository} from "../statuses/StatusesRepository";
import {StatusLikesRepository} from "../statuses/StatusLikesRepository";
import {BtfsHashRepository} from "../btfs-sync/BtfsHashRepository";
import {UsersRepository} from "../users";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {config} from "../config";
import {TransactionsStatisticsService} from "./TransactionsStatisticsService";

@Module({
    controllers: [StatisticsController],
    providers: [
        StatisticsService,
        TransactionsStatisticsService,
        {
            provide: "transactionsStatisticsServiceAxiosInstance",
            useValue: axios.create({
                baseURL: config.IGNITE_PASSWORD_HASH_API_BASE_URL
            })
        }
    ],
    imports: [
        TypeOrmModule.forFeature([
            StatusesRepository,
            StatusLikesRepository,
            BtfsHashRepository,
            UsersRepository,
            StatusLikesRepository,
            UserSubscriptionsRepository
        ])
    ]

})
export class StatisticsModule {

}
