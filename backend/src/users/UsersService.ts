import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {User} from "./entities";
import {UsersRepository} from "./UsersRepository";
import {UserStatisticsRepository} from "./UserStatisticsRepository";
import {UsersMapper} from "./UsersMapper";
import {CreateUserRequest} from "./types/request";
import {UserResponse} from "./types/response";
import {UserSubscriptionsRepository} from "../user-subscriptions";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly subscriptionsRepository: UserSubscriptionsRepository,
                private readonly usersMapper: UsersMapper) {
    }

    public async saveUser(createUserRequest: CreateUserRequest): Promise<UserResponse> {
        const existingUser = await this.usersRepository.findByEthereumAddress(createUserRequest.address);

        if (existingUser) {
            return this.usersMapper.toUserResponse(existingUser);
        }

        const user = await this.usersRepository.save(this.usersMapper.fromCreateUserRequest(createUserRequest))

        return this.usersMapper.toUserResponse(
            user,{
                followsCount: 0,
                followersCount: 0,
                statusesCount: 0,
                user,
                id: ""
            }
        );
    }

    public async getCurrentUser(user: User): Promise<UserResponse> {
        return this.usersMapper.toUserResponse(user, await this.userStatisticsRepository.findByUser(user))
    }

    public async findUserByEthereumAddress(address: string): Promise<UserResponse> {
        const user = await this.findUserEntityByEthereumAddress(address);
        const userStatistics = await this.userStatisticsRepository.findByUser(user);

        return this.usersMapper.toUserResponse(user, userStatistics);
    }

    public async findUserEntityByEthereumAddress(address: string): Promise<User> {
        const user = await this.usersRepository.findByEthereumAddress(address);

        if (user === undefined) {
            throw new HttpException(`Could not find user with address ${address}`, HttpStatus.NOT_FOUND);
        }

        return user;
    }

    public async getUserProfile(address: string, currentUser?: User): Promise<UserResponse> {
        const user = await this.usersRepository.findByUsername(address);

        if (!user) {
            throw new HttpException(`Could not find user with address ${address}`, HttpStatus.NOT_FOUND);
        }

        const userStatistics = await this.userStatisticsRepository.findByUser(user);
        const following = currentUser && await this.subscriptionsRepository.existsBySubscribedUserAndSubscribedTo(
            currentUser, user
        );
        const followed = currentUser && await this.subscriptionsRepository.existsBySubscribedUserAndSubscribedTo(
            user, currentUser
        );

        return this.usersMapper.toUserResponse(user, userStatistics, following, followed);
    }

    public async getCurrentUserProfile(currentUser: User): Promise<UserResponse> {
        const userStatistics = await this.userStatisticsRepository.findByUser(currentUser);
        return this.usersMapper.toUserResponse(currentUser, userStatistics);
    }
}
