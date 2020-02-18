import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {UserResponse} from "../users/types/response";
import {UsersService} from "../users";
import {User} from "../users/entities";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "12345"
        });
    }

    public async validate(payload: UserResponse): Promise<User> {
        return await this.usersService.findUserEntityByEthereumAddress(payload.ethereumAddress);
    }
}
