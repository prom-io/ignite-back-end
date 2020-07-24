import {Expose} from "class-transformer";

export class IgniteStatisticsResponse {
    @Expose({name: "users_count"})
    usersCount: number;

    @Expose({name: "daily_active_users_count"})
    dailyActiveUsersCount: number;

    @Expose({name: "last_month_users_count"})
    lastMonthUsersCount: number;

    @Expose({name: "dds_chunks_count"})
    ddsChunksCount: number;

    @Expose({name: "binance_chain_transactions_count"})
    binanceChainTransactionsCount: number;

    @Expose({name: "weekly_activities_count"})
    weeklyActivitiesCount: number;

    @Expose({name: "statuses_count"})
    statusesCount: number;

    @Expose({name: "last_two_weeks_users_count"})
    lastTwoWeeksUsersCount: number;

    constructor(plainObject: IgniteStatisticsResponse) {
        Object.assign(this, plainObject);
    }
}
