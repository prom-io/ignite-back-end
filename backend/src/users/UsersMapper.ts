import {Injectable} from "@nestjs/common";
import uuid from "uuid";
import {UserResponse} from "./types/response";
import {CreateUserRequest} from "./types/request";
import {User, UserStatistics} from "./entities";
import {BCryptPasswordEncoder} from "../bcrypt";

@Injectable()
export class UsersMapper {
    constructor(private readonly bCryptPasswordEncoder: BCryptPasswordEncoder) {
    }

    public toUserResponse(user: User, userStatistics?: UserStatistics): UserResponse {
        return new UserResponse({
            avatar: user.avatarUri,
            displayName: user.displayedName,
            acct: user.displayedName,
            id: user.ethereumAddress,
            avatarStatic: user.avatarUri,
            createdAt: user.createdAt.toISOString(),
            followersCount: userStatistics ? userStatistics.followersCount : 0,
            followingCount: userStatistics ? userStatistics.followsCount : 0,
            header: user.avatarUri,
            headerStatic: user.avatarUri,
            username: user.username || user.ethereumAddress,
            remote: user.remote,
            statusesCount: userStatistics ? userStatistics.statusesCount : 0
        })
    }

    public fromCreateUserRequest(createUserRequest: CreateUserRequest): User {
        return {
            id: uuid(),
            ethereumAddress: createUserRequest.address,
            remote: false,
            avatarUri: null,
            displayedName: createUserRequest.address,
            createdAt: new Date(),
            privateKey: this.bCryptPasswordEncoder.encode(createUserRequest.privateKey, 12),
            username: createUserRequest.address
        }
    }
}
