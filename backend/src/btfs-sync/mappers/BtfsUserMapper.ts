import {Injectable} from "@nestjs/common";
import {User} from "../../users/entities";
import {BtfsUser} from "../types/btfs-entities";

@Injectable()
export class BtfsUserMapper {

    public fromUser(user: User): BtfsUser {
        return {
            ...user,
            createdAt: user.createdAt.toISOString(),
            address: user.ethereumAddress,
        }
    }

}
