import {ClassSerializerInterceptor, Controller, Get, UseInterceptors} from "@nestjs/common";
import {StatisticsService} from "./StatisticsService";
import {IgniteStatisticsResponse} from "./types/response";

@Controller("api/v1/statistics")
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    public getStatistics(): Promise<IgniteStatisticsResponse> {
        return this.statisticsService.getStatistics();
    }

    @Get("health-check")
    public healthCheck() {
        return this.statisticsService.healthCheck()
    }
}
