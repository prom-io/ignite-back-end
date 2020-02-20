import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {User} from "./entities";
import {UsersRepository} from "./UsersRepository";
import {UsersMapper} from "./UsersMapper";
import {CreateUserRequest} from "./types/request";
import {UserResponse} from "./types/response";
import {UserStatisticsRepository} from "./UserStatisticsRepository";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly userMapper: UsersMapper) {
    }

    public async saveUser(createUserRequest: CreateUserRequest): Promise<UserResponse> {
        return this.userMapper.toUserResponse(await this.usersRepository.save(this.userMapper.fromCreateUserRequest(createUserRequest)));
    }

    public async findUserByEthereumAddress(address: string): Promise<UserResponse> {
        return this.userMapper.toUserResponse(await this.findUserEntityByEthereumAddress(address));
    }

    public async findUserEntityByEthereumAddress(address: string): Promise<User> {
        const user = await this.usersRepository.findByEthereumAddress(address);

        if (user === null) {
            throw new HttpException(`Could not find user with address ${address}`, HttpStatus.NOT_FOUND);
        }

        return user;
    }
}
