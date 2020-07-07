import {EntityRepository, Repository} from "typeorm";
import uuid from "uuid/v4"
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

    public async findOrCreateByUser(user: User): Promise<UserStatistics> {
        let userStatistics: UserStatistics | undefined = await this.findByUser(user);

        if (userStatistics) {
            return userStatistics;
        } else {
            userStatistics = {
                id: uuid(),
                statusesCount: 0,
                followsCount: 0,
                followersCount: 0,
                user
            };
            userStatistics = await this.save(userStatistics);
            return userStatistics;
        }
    }
}
