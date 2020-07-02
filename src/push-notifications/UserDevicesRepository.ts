import {EntityRepository, In, Repository} from "typeorm";
import {UserDevice} from "./entities";
import {User} from "../users/entities";

@EntityRepository(UserDevice)
export class UserDevicesRepository extends Repository<UserDevice>{
    public findByUser(user: User): Promise<UserDevice[]> {
        return this.find({
            where: {
                user,
                fcmTokenExpired: false
            }
        });
    }

    public findByUserIn(users: User[]): Promise<UserDevice[]> {
        return this.find({
            where: {
                user: In(users)
            }
        });
    }
}
