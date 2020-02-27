import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users";
import {User} from "../users/entities";
import {BCryptPasswordEncoder} from "../bcrypt";
import {UsersMapper} from "../users/UsersMapper";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
                private readonly bCryptPasswordEncoder: BCryptPasswordEncoder,
                private readonly jwtService: JwtService,
                private readonly usersMapper: UsersMapper) {
    }

    public async validateUser(username: string, password: string): Promise<User | null> {
        try {
            const user = await this.usersService.findUserEntityByEthereumAddress(username);

            if (this.bCryptPasswordEncoder.matches(password, user.privateKey)) {
                return user;
            }

            return null;
        } catch (error) {
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
