import {Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {Status} from "./entities";
import {StatusResponse} from "./types/response";
import {CreateStatusRequest} from "./types/request";
import {User} from "../users/entities";
import {UsersMapper} from "../users/UsersMapper";

@Injectable()
export class StatusesMapper {
    constructor(private readonly userMapper: UsersMapper) {
    }

    public toStatusResponse(status: Status, likesCount: number, likedByCurrentUser: boolean): StatusResponse {
        return {
            author: this.userMapper.toUserResponse(status.author),
            createdAt: status.createdAt.toISOString(),
            id: status.id,
            likesCount,
            likedByCurrentUser,
            text: status.text
        }
    }

    public fromCreateStatusRequest(createStatusRequest: CreateStatusRequest, author: User): Status {
        return  {
            id: uuid(),
            text: createStatusRequest.text,
            createdAt: new Date(),
            author,
            updatedAt: null,
            remote: false
        }
    }
}
