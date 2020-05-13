import {Injectable} from "@nestjs/common";
import {StatusLike} from "../../statuses/entities";
import {BtfsStatusLike} from "../types/btfs-entities";
import {BtfsUsersMapper} from "./BtfsUsersMapper";
import {BtfsStatusesMapper} from "./BtfsStatusesMapper";

@Injectable()
export class BtfsStatusLikesMapper {
    constructor(private btfsStatusesMapper: BtfsStatusesMapper,
                private btfsUsersMapper: BtfsUsersMapper) {
    }

    public fromStatusLike(statusLike: StatusLike): BtfsStatusLike {
        return {
            id: statusLike.id,
            createdAt: statusLike.createdAt.toISOString(),
            user: this.btfsUsersMapper.fromUser(statusLike.user),
            status: this.btfsStatusesMapper.fromStatus(statusLike.status)
        }
    }
}
