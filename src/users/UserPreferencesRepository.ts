import {EntityRepository, Repository} from "typeorm";
import {UserPreferences} from "./entities/UserPreferences";
import {User} from "./entities";

@EntityRepository(UserPreferences)
export class UserPreferencesRepository extends Repository<UserPreferences> {
    public findByUser(user: User): Promise<UserPreferences | null> {
        return this.findOne({
            where: {
                user
            },
            relations: ["user"]
        })
    }
}
