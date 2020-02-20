import {Injectable} from "@nestjs/common";
import uuid from "uuid";
import {UserStatisticsMapper} from "./UserStatisticsMapper";
import {UserResponse, UserProfileResponse} from "./types/response";
import {CreateUserRequest} from "./types/request";
import {User, UserStatistics} from "./entities";
import {BCryptPasswordEncoder} from "../bcrypt";

@Injectable()
export class UsersMapper {
    constructor(private readonly bCryptPasswordEncoder: BCryptPasswordEncoder,
                private readonly userStatisticsMapper: UserStatisticsMapper) {
    }

    public toUserResponse(user: User): UserResponse {
        return {
            avatarUri: user.avatarUri,
            displayedName: user.displayedName,
            ethereumAddress: user.ethereumAddress,
            id: user.ethereumAddress,
            remote: user.remote
        }
    }

    public toUserProfileResponse(user: User, userStatistics: UserStatistics, currentUserSubscriptionId?: string): UserProfileResponse {
        return {
            avatarUri: user.avatarUri,
            displayedName: user.displayedName,
            ethereumAddress: user.ethereumAddress,
            id: user.ethereumAddress,
            remote: user.remote,
            stats: this.userStatisticsMapper.toUserStatisticsResponse(userStatistics),
            currentUserSubscriptionId,
            createdAt: user.createdAt.toISOString()
        }
    }

    public fromCreateUserRequest(createUserRequest: CreateUserRequest): User {
        return {
            id: uuid(),
            ethereumAddress: createUserRequest.address,
            remote: false,
            avatarUri: null,
            displayedName: createUserRequest.address,
            createdAt: new Date(),
            privateKey: this.bCryptPasswordEncoder.encode(createUserRequest.privateKey, 12)
        }
    }
}
