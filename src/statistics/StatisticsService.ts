import {Injectable} from "@nestjs/common";
import {Cron, NestSchedule} from "nest-schedule";
import {LoggerService} from "nest-logger";
import {subDays, subMonths} from "date-fns";
import {UsersRepository} from "../users";
import {BtfsHashRepository} from "../btfs-sync/BtfsHashRepository";
import {IgniteStatisticsResponse} from "./types/response";
import {StatusesRepository} from "../statuses/StatusesRepository";
import {StatusLikesRepository} from "../statuses/StatusLikesRepository";
import {StatusReferenceType} from "../statuses/entities";

@Injectable()
export class StatisticsService extends NestSchedule {
    private cachedStatistics?: IgniteStatisticsResponse = undefined;

    constructor(private readonly usersRepository: UsersRepository,
                private readonly btfsHashRepository: BtfsHashRepository,
                private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly log: LoggerService) {
        super();
    }

    public async getStatistics(): Promise<IgniteStatisticsResponse> {
        this.log.debug("Getting Ignite statistics");
        if (this.cachedStatistics) {
            this.log.debug("Getting cached version of Ignite statistics");
            return this.cachedStatistics;
        } else {
            this.log.debug("Ignite statistics is not present in cache");
            await this.updateStatistics();
            return this.cachedStatistics;
        }
    }

    @Cron("*/30 * * * *", {immediate: true, waiting: true})
    public async updateStatistics(): Promise<void> {
        this.log.info("Calculating Ignite statistics");
        const usersCount = await this.usersRepository.countAll();
        const dailyActiveUsersCount = await this.usersRepository.countAllHavingActivityWithinLastDay();
        const lastMonthUsersCount = await this.usersRepository.countAllByCreatedAtLessAfter(subMonths(new Date(), 1));
        const ddsChunksCount = await this.btfsHashRepository.countAll();

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

        this.log.debug(`Users count is ${usersCount}`);
        this.log.debug(`Daily active users count is ${dailyActiveUsersCount}`);
        this.log.debug(`Last month users count is ${lastMonthUsersCount}`);
        this.log.debug(`DDS chunks count is ${ddsChunksCount}`);
        this.log.debug(`Last week likes count is ${lastWeekLikesCount}`);
        this.log.debug(`Last week statuses count is ${lastWeekStatusesCount}`);
        this.log.debug(`Last week comments count is ${lastWeekCommentsCount}`);
        this.log.debug(`Last week reposts count is ${lastWeekRepostsCount}`);
        this.log.debug(`Weekly activities count is ${weeklyActivitiesCount}`);

        this.cachedStatistics = new IgniteStatisticsResponse({
            usersCount,
            dailyActiveUsersCount,
            lastMonthUsersCount,
            ddsChunksCount,
            weeklyActivitiesCount,
            transactionsCount: 0
        });
    }
}
