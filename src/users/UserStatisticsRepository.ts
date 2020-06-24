import {EntityRepository, Repository} from "typeorm";
import {UserStatistics, User} from "./entities";

@EntityRepository(UserStatistics)
export class UserStatisticsRepository extends Repository<UserStatistics> {
    public findByUser(user: User): Promise<UserStatistics | undefined> {
        return this.findOne({
            where: {
                user
            }
        })
    }
}
