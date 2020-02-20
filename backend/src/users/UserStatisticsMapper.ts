import {Injectable} from "@nestjs/common";
import {UserStatistics} from "./entities";
import {UserStatisticsResponse} from "./types/response";

@Injectable()
export class UserStatisticsMapper {

    public toUserStatisticsResponse(userStatistics: UserStatistics): UserStatisticsResponse {
        return {
            followersCount: userStatistics.followersCount,
            followsCount: userStatistics.followsCount,
            statusesCount: userStatistics.statusesCount
        }
    }
}
