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

    @Expose({name: "transactions_count"})
    transactionsCount: number;

    @Expose({name: "weekly_activities_count"})
    weeklyActivitiesCount: number;

    constructor(plainObject: IgniteStatisticsResponse) {
        Object.assign(this, plainObject);
    }
}
