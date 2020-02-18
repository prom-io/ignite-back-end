import {Injectable} from "@nestjs/common";
import uuid from "uuid";
import {UserResponse} from "./types/response";
import {CreateUserRequest} from "./types/request";
import {User} from "./entities";
import {BCryptPasswordEncoder} from "../bcrypt";

@Injectable()
export class UsersMapper {
    constructor(private readonly bCryptPasswordEncoder: BCryptPasswordEncoder) {
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
