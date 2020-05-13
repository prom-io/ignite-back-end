import {Injectable} from "@nestjs/common";
import {User} from "../../users/entities";
import {BtfsUser} from "../types/btfs-entities";

@Injectable()
export class BtfsUsersMapper {

    public fromUser(user: User): BtfsUser {
        return {
            id: user.id,
            address: user.ethereumAddress,
            createdAt: user.createdAt.toISOString(),
            avatarUri: user.avatarUri,
            username: user.username,
            displayedName: user.displayedName
        }
    }

}
