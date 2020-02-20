import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {User} from "./entities";
import {UsersRepository} from "./UsersRepository";
import {UserStatisticsRepository} from "./UserStatisticsRepository";
import {UsersMapper} from "./UsersMapper";
import {CreateUserRequest} from "./types/request";
import {UserResponse, UserProfileResponse} from "./types/response";
import {UserSubscriptionsRepository} from "../user-subscriptions";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly subscriptionsRepository: UserSubscriptionsRepository,
                private readonly usersMapper: UsersMapper) {
    }

    public async saveUser(createUserRequest: CreateUserRequest): Promise<UserResponse> {
        return this.usersMapper.toUserResponse(await this.usersRepository.save(this.usersMapper.fromCreateUserRequest(createUserRequest)));
    }

    public async findUserByEthereumAddress(address: string): Promise<UserResponse> {
        return this.usersMapper.toUserResponse(await this.findUserEntityByEthereumAddress(address));
    }

    public async findUserEntityByEthereumAddress(address: string): Promise<User> {
        const user = await this.usersRepository.findByEthereumAddress(address);

        if (user === undefined) {
            throw new HttpException(`Could not find user with address ${address}`, HttpStatus.NOT_FOUND);
        }

        return user;
    }

    public async getUserProfile(address: string, currentUser?: User): Promise<UserProfileResponse> {
        const user = await this.usersRepository.findByEthereumAddress(address);

        if (!user) {
            throw new HttpException(`Could not find user with address ${address}`, HttpStatus.NOT_FOUND);
        }

        const userStatistics = await this.userStatisticsRepository.findByUser(user);
        let currentUserSubscriptionId: string | null = null;

        if (currentUser) {
            const subscription = await this.subscriptionsRepository.findBySubscribedUserAndSubscribedTo(currentUser, user);
            currentUserSubscriptionId = subscription ? subscription.id : null;
        }

        return this.usersMapper.toUserProfileResponse(user, userStatistics, currentUserSubscriptionId);
    }

    public async getCurrentUserProfile(currentUser: User): Promise<UserProfileResponse> {
        const userStatistics = await this.userStatisticsRepository.findByUser(currentUser);
        return this.usersMapper.toUserProfileResponse(currentUser, userStatistics);
    }
}
