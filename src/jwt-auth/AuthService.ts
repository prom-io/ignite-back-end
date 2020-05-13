import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {LoggerService} from "nest-logger";
import {UsersService} from "../users";
import {User} from "../users/entities";
import {BCryptPasswordEncoder} from "../bcrypt";
import {UsersMapper} from "../users/UsersMapper";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
                private readonly bCryptPasswordEncoder: BCryptPasswordEncoder,
                private readonly jwtService: JwtService,
                private readonly usersMapper: UsersMapper,
                private readonly log: LoggerService) {
    }

    public async validateUser(username: string, password: string): Promise<User | null> {
        try {
            if (!password.startsWith("0x")) {
                password = `0x${password}`;
            }

            this.log.info(`Login attempt with the following username: ${username}`);
            const user = await this.usersService.findUserEntityByEthereumAddress(username);

            if (this.bCryptPasswordEncoder.matches(password, user.privateKey)) {
                return user;
            }

            this.log.info(`Invalid password has been provided for ${username}, bCryptPasswordEncoder returned false`);

            return null;
        } catch (error) {
            if (error instanceof HttpException && error.getStatus() === HttpStatus.NOT_FOUND) {
                this.log.info(`No user has been found with the following username: ${username}`)
            } else {
                this.log.error("Unexpected error occurred upon login attempt");
                console.error(error);
            }

            return null;
        }
    }

    public async login(user: User): Promise<any> {
        const payload = Object.assign({}, this.usersMapper.toUserResponse(user));

        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
