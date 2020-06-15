import {Injectable} from "@nestjs/common";
import uuid from "uuid";
import {UserResponse} from "./types/response";
import {CreateUserRequest} from "./types/request";
import {User, UserDynamicFields, UserStatistics} from "./entities";
import {BCryptPasswordEncoder} from "../bcrypt";
import {config} from "../config";
import {UserStatisticsRepository} from "./UserStatisticsRepository";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";

@Injectable()
export class UsersMapper {
    constructor(private readonly bCryptPasswordEncoder: BCryptPasswordEncoder,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly userSubscriptionsRepository: UserSubscriptionsRepository) {
    }

    public async toUserResponseAsync(user: User, currentUser?: User, includePasswordHash: boolean = false): Promise<UserResponse> {
        const userStatistics = await this.userStatisticsRepository.findByUser(user);
        const following = currentUser && await this.userSubscriptionsRepository.existsBySubscribedUserAndSubscribedToNotReverted(
            currentUser,
            user
        );
        const followed = currentUser && await this.userSubscriptionsRepository.existsBySubscribedUserAndSubscribedToNotReverted(
            user,
            currentUser
        );

        return this.toUserResponse(user, userStatistics, following, followed);
    }

    public toUserResponse(
        user: User,
        userStatistics?: UserStatistics,
        following: boolean = false,
        followedBy: boolean = false,
        includePasswordHash: boolean = false
    ): UserResponse {
        let avatar: string;

        if (user.avatar) {
            avatar = `${config.API_HOST}/api/v1/media/${user.avatar.name}`;
        } else if (user.avatarUri) {
            avatar = user.avatarUri;
        } else {
            avatar = config.DEFAULT_AVATAR_URL;
        }

        return new UserResponse({
            avatar,
            displayName: user.getLatestDynamicFields().displayedName,
            acct: user.getLatestDynamicFields().displayedName,
            id: user.ethereumAddress,
            avatarStatic: user.avatarUri,
            createdAt: user.createdAt.toISOString(),
            followersCount: userStatistics ? userStatistics.followersCount : 0,
            followingCount: userStatistics ? userStatistics.followsCount : 0,
            header: user.avatarUri || `${config.HOST}/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png`,
            headerStatic: user.avatarUri || `${config.HOST}/api/v1/media/b653997e-7a4a-482f-a9fc-ea546729da5e.png`,
            username: user.getLatestDynamicFields().username || user.ethereumAddress,
            remote: user.remote,
            statusesCount: userStatistics ? userStatistics.statusesCount : 0,
            emojis: [],
            note: "",
            fields: [],
            following,
            followedBy,
            bio: user.bio,
            passwordHash: includePasswordHash ? user.getLatestDynamicFields().passwordHash : undefined
        })
    }

    public fromCreateUserRequest(createUserRequest: CreateUserRequest): User {
        const dynamicFields: UserDynamicFields = {
            id: uuid(),
            bio: null,
            createdAt: new Date(),
            passwordHash: this.bCryptPasswordEncoder.encode(createUserRequest.privateKey),
            avatar: null,
            displayedName: createUserRequest.displayedName,
            username: createUserRequest.username,
        };
        return new User({
            id: uuid(),
            ethereumAddress: createUserRequest.address,
            remote: false,
            displayedName: createUserRequest.displayedName ? createUserRequest.displayedName : createUserRequest.address,
            createdAt: new Date(),
            privateKey: this.bCryptPasswordEncoder.encode(createUserRequest.privateKey, 12),
            username: createUserRequest.username,
            dynamicFields: [dynamicFields]
        });
    }
}
