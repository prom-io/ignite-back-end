import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import {differenceInMinutes} from "date-fns";
import {subDays, subMonths, subWeeks} from "date-fns";
import {uniqBy} from "lodash";
import {UsersRepository} from "../users";
import {BtfsHashRepository} from "../btfs-sync/BtfsHashRepository";
import {IgniteStatisticsResponse} from "./types/response";
import {StatusesRepository} from "../statuses/StatusesRepository";
import {StatusLikesRepository} from "../statuses/StatusLikesRepository";
import {StatusReferenceType} from "../statuses/entities";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {User} from "../users/entities";
import {TransactionsStatisticsService} from "./TransactionsStatisticsService";

@Injectable()
export class StatisticsService {
    private cachedStatistics?: IgniteStatisticsResponse = undefined;
    private lastCalculationDate?: Date = undefined;

    constructor(private readonly usersRepository: UsersRepository,
                private readonly btfsHashRepository: BtfsHashRepository,
                private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly userSubscriptionsRepository: UserSubscriptionsRepository,
                private readonly transactionsStatisticsService: TransactionsStatisticsService,
                private readonly log: LoggerService) {
    }

    public async getStatistics(): Promise<IgniteStatisticsResponse> {
        this.log.debug("Getting Ignite statistics");
        if (this.cachedStatistics && this.lastCalculationDate && differenceInMinutes(new Date(), this.lastCalculationDate) < 30) {
            this.log.debug("Getting cached version of Ignite statistics");
            return this.cachedStatistics;
        } else {
            this.log.debug("Ignite statistics is not present in cache");
            await this.updateStatistics();
            return this.cachedStatistics;
        }
    }

    private async updateStatistics(): Promise<void> {
        this.log.info("Calculating Ignite statistics");
        const usersCount = await this.usersRepository.countAll();
        const lastMonthUsersCount = await this.usersRepository.countAllByCreatedAtLessAfter(subMonths(new Date(), 1));
        const lastTwoWeeksUsersCount = await this.usersRepository.countAllByCreatedAtLessAfter(subWeeks(new Date(), 2));
        const statusesCount = await this.statusesRepository.countAll();
        let ddsChunksCount: number;

        try {
            ddsChunksCount = Number((await this.transactionsStatisticsService.getBtfsChunksCount()).data.txCount)
        } catch (error) {
            this.log.error("Error occurred when tried to get BTFS chinks count");
            console.log(error);
            ddsChunksCount = await this.btfsHashRepository.countAll();
        }

        let binanceChainTransactionsCount: number = 0;

        try {
            binanceChainTransactionsCount = Number((await this.transactionsStatisticsService.getBinanceChainTransactionsCount()).data.txCount);
        } catch (error) {
            this.log.error("Error occurred when tried to get Binance chain transactions count");
            console.log(error);
        }

        const weekAgo = subDays(new Date(), 7);

        const lastWeekLikesCount = await this.statusLikesRepository.countByCreatedAtAfter(weekAgo);
        const lastWeekStatusesCount = await this.statusesRepository.countByCreatedAtAfter(weekAgo);
        const lastWeekCommentsCount = await this.statusesRepository.countByCreatedAtAfterAndStatusReferenceType(
            weekAgo,
            StatusReferenceType.COMMENT
        );
        const lastWeekRepostsCount = await this.statusesRepository.countByCreatedAtAfterAndStatusReferenceType(
            weekAgo,
            StatusReferenceType.REPOST
        );

        const weeklyActivitiesCount = lastWeekLikesCount + lastWeekStatusesCount + lastWeekCommentsCount + lastWeekRepostsCount;

        const dayAgo = subDays(new Date(), 1);
        const statusesForLastDay = await this.statusesRepository.findAllByCreatedAtAfter(dayAgo);
        const statusLikesForLastDay = await this.statusLikesRepository.findAllByCreatedAtAfter(dayAgo);
        const userSubscriptionsForLastDay = await this.userSubscriptionsRepository.findAllByCreatedAtAfter(dayAgo);

        let dailyActiveUsers: User[] = [];

        statusesForLastDay.map(status => dailyActiveUsers.push(status.author));
        statusLikesForLastDay.map(statusLike => dailyActiveUsers.push(statusLike.user));
        userSubscriptionsForLastDay.map(userSubscription => dailyActiveUsers.push(userSubscription.subscribedUser));

        dailyActiveUsers = uniqBy(dailyActiveUsers, "id");

        this.log.debug(`Users count is ${usersCount}`);
        this.log.debug(`Daily active users count is ${dailyActiveUsers.length}`);
        this.log.debug(`Last month users count is ${lastMonthUsersCount}`);
        this.log.debug(`Last two weeks users count is ${lastTwoWeeksUsersCount}`);
        this.log.debug(`DDS chunks count is ${ddsChunksCount}`);
        this.log.debug(`Last week likes count is ${lastWeekLikesCount}`);
        this.log.debug(`Last week statuses count is ${lastWeekStatusesCount}`);
        this.log.debug(`Last week comments count is ${lastWeekCommentsCount}`);
        this.log.debug(`Last week reposts count is ${lastWeekRepostsCount}`);
        this.log.debug(`Weekly activities count is ${weeklyActivitiesCount}`);

        this.cachedStatistics = new IgniteStatisticsResponse({
            usersCount,
            dailyActiveUsersCount: dailyActiveUsers.length,
            lastMonthUsersCount,
            weeklyActivitiesCount,
            binanceChainTransactionsCount,
            ddsChunksCount,
            statusesCount,
            lastTwoWeeksUsersCount
        });
        this.lastCalculationDate = new Date();
    }

    public async healthCheck(): Promise<void> {
        // test DB
        const user = await this.usersRepository.findOne()
        if (!user) {
            throw new InternalServerErrorException("No user found in DB");
        }
    }
}
