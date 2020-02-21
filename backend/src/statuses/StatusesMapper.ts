import {Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {Status} from "./entities";
import {StatusResponse} from "./types/response";
import {CreateStatusRequest} from "./types/request";
import {User, UserStatistics} from "../users/entities";
import {UsersMapper} from "../users/UsersMapper";

@Injectable()
export class StatusesMapper {
    constructor(private readonly userMapper: UsersMapper) {
    }

    public toStatusResponse(status: Status, favouritesCount: number, favourited: boolean, userStatistics?: UserStatistics): StatusResponse {
        return new StatusResponse({
            account: this.userMapper.toUserResponse(status.author, userStatistics),
            createdAt: status.createdAt.toISOString(),
            id: status.id,
            favouritesCount,
            favourited,
            content: status.text
        })
    }

    public fromCreateStatusRequest(createStatusRequest: CreateStatusRequest, author: User): Status {
        return  {
            id: uuid(),
            text: createStatusRequest.status,
            createdAt: new Date(),
            author,
            updatedAt: null,
            remote: false
        }
    }
}
